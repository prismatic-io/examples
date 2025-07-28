import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import { Tool, tool } from "@openai/agents";

export interface FlowConfig {
  id: string;
  name: string;
  description?: string;
  webhookUrl: string;
  inputSchema?: any;
}

export interface PrismaticClientConfig {
  apiUrl: string;
  token: string;
}

export interface EmbeddedUserConfig {
  sub: string; // Unique user ID (UUID recommended)
  organization: string; // Organization ID from Embedded tab
  customer: string; // External ID of the customer
  external_id?: string; // Usually same as sub
  name?: string; // User's name
  customer_name?: string; // Customer name (creates new if doesn't exist)
  role?: "admin" | "user"; // Defaults to "admin"
}

/**
 * Generate an embedded user JWT for Prismatic authentication
 * @param userConfig - Configuration for the embedded user
 * @param signingKey - The signing key for JWT generation
 * @returns JWT token string
 */
export function generateEmbeddedUserJWT(
  userConfig: EmbeddedUserConfig,
  signingKey: string,
): string {
  const currentTime = Math.floor(Date.now() / 1000);

  const payload = {
    sub: userConfig.sub,
    organization: userConfig.organization,
    customer: userConfig.customer,
    external_id: userConfig.external_id || userConfig.sub,
    name: userConfig.name,
    customer_name: userConfig.customer_name,
    role: userConfig.role || "admin",
    iat: currentTime,
    exp: currentTime + 3600, // 1 hour expiration
  };

  // Remove undefined fields
  Object.keys(payload).forEach((key) => {
    if (payload[key as keyof typeof payload] === undefined) {
      delete payload[key as keyof typeof payload];
    }
  });

  // Sign with RS256 algorithm
  const token = jwt.sign(payload, signingKey, {
    algorithm: "RS256",
  });

  return token;
}

/**
 * Authenticate the JWT token with Prismatic's embedded API
 * @param token - The JWT token to authenticate
 * @param baseUrl - The base Prismatic URL
 * @returns Promise that resolves if authentication is successful
 */
export async function authenticateEmbeddedUser(
  token: string,
  baseUrl: string = "https://app.prismatic.io",
): Promise<void> {
  const response = await fetch(`${baseUrl}/embedded/authenticate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.statusText}`);
  }
}

/**
 * Create an authenticated Prismatic GraphQL client
 * @param token - The JWT token for authentication
 * @param apiUrl - The Prismatic API URL
 * @returns GraphQL client function
 */
export function createPrismaticClient(
  token: string,
  apiUrl: string = "https://app.prismatic.io/api",
) {
  return async function query(graphqlQuery: string, variables?: any) {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables,
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      const gqlErrors = result.errors;
      throw new Error(`GraphQL request failed: ${JSON.stringify(gqlErrors)}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  };
}

/**
 * Query for customer's agent flows
 * @param client - The authenticated GraphQL client
 * @param customerId - The customer ID
 * @returns Array of flow configurations
 */
export async function getCustomerAgentFlows(
  client: ReturnType<typeof createPrismaticClient>,
  customerId: string,
): Promise<FlowConfig[]> {
  const query = `
  query getAgentFlows($customer_externalId: String!) {
    instances(customer_ExternalId:$customer_externalId) {
      nodes {
        id
        name
        enabled
        flowConfigs {
          nodes {
            flow {
              name
              description
              schemas
            }
            id
            webhookUrl
          }
        }
      }
    }
  }

  `;

  const data = await client(query, { customer_externalId: customerId });

  const flows: FlowConfig[] = [];
  // Extract all agent flows from all instances
  data.instances?.nodes?.forEach((instance: any) => {
    if (instance.enabled === true) {
      instance.flowConfigs?.nodes?.forEach((flowConfig: any) => {
        console.log("[FlowConfig]", flowConfig.flow);
        const schemas = JSON.parse(flowConfig.flow.schemas);
        flows.push({
          id: flowConfig.id,
          name: flowConfig.flow.name,
          description: flowConfig.flow.description,
          webhookUrl: flowConfig.webhookUrl,
          inputSchema: {
            ...schemas.invoke,
          },
        });
      });
    }
  });

  return flows;
}

/**
 * Create OpenAI agent tools from Prismatic flows
 * @param flows - Array of flow configurations
 * @returns Array of OpenAI agent tool definitions
 */
export function createFlowTools(flows: FlowConfig[]): Tool[] {
  return flows.map((flow) =>
    tool({
      name: flow.name.replace(/\s+/g, "_").toLowerCase(),
      strict: false,
      description:
        flow.description || `Execute the ${flow.name} Prismatic flow`,
      parameters: flow.inputSchema || {
        type: "object",
        properties: {},
      },
      async execute(args: any) {
        return await invokeFlow(flow, args);
      },
    }),
  );
}

/**
 * Invoke a Prismatic flow via HTTP
 * @param flowConfig - The flow configuration
 * @param args - Arguments to pass to the flow
 * @returns Flow execution result
 */
export async function invokeFlow(flowConfig: FlowConfig, args: any) {
  try {
    const response = await fetch(flowConfig.webhookUrl, {
      method: "POST",
      body: JSON.stringify(args),
      headers: {
        "Content-Type": "application/json",
        "prismatic-synchronous": "true",
      },
    });

    if (!response.ok) {
      throw new Error(`Flow invocation failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error invoking flow ${flowConfig.name}:`, error);
    throw error;
  }
}

/**
 * Main function to set up Prismatic integration tools
 * @param signingKey - The signing key for JWT generation
 * @param userConfig - Configuration for the embedded user
 * @param apiUrl - The Prismatic API URL
 * @returns Array of OpenAI agent tools
 */
export async function setupPrismaticTools(
  signingKey: string,
  userConfig: EmbeddedUserConfig,
  apiUrl?: string,
): Promise<Tool[]> {
  // Generate JWT for the customer
  const jwtToken = generateEmbeddedUserJWT(userConfig, signingKey);

  // Authenticate the JWT token with Prismatic
  // This will also create the embedded user if they don't already exist
  const baseUrl = apiUrl
    ? apiUrl.replace("/api", "")
    : "https://app.prismatic.io";

  await authenticateEmbeddedUser(jwtToken, baseUrl);

  // Create authenticated client
  const client = createPrismaticClient(jwtToken, apiUrl);

  // Get customer's agent flows
  const flows = await getCustomerAgentFlows(client, userConfig.customer);

  // Create tools from flows
  const tools = createFlowTools(flows);

  return tools;
}

export default setupPrismaticTools;
