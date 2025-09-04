import { CustomerClient, OrganizationClient, FlowConfig } from "../types";

// Shared GraphQL query for fetching agent flows
const AGENT_FLOWS_QUERY = `
  query getAgentFlows($customer_externalId: String!) {
    instances(
      customer_ExternalId: $customer_externalId
      needsDeploy: false
      enabled: true
    ) {
      nodes {
        id
        name
        enabled
        integration {
          id
          name
        }
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

/**
 * Query for agent flows with unified client support
 * @param client - The authenticated CustomerClient or OrganizationClient
 * @param customerExternalId - The customer's external ID (optional for CustomerClient)
 * @param excludeIntegrationId - Optional integration ID to exclude (prevents self-invocation)
 * @returns Array of flow configurations
 */
export async function getAgentFlows(
  client: CustomerClient | OrganizationClient,
  customerExternalId?: string,
  excludeIntegrationId?: string,
): Promise<FlowConfig[]> {
  // Determine the customer ID based on client type
  const customerId =
    "customerId" in client ? client.customerId : customerExternalId;

  if (!customerId) {
    throw new Error(
      "Customer ID is required for OrganizationClient or must be present in CustomerClient",
    );
  }

  const data = await client.query(AGENT_FLOWS_QUERY, {
    customer_externalId: customerId,
  });

  const flows: FlowConfig[] = [];

  // Extract all agent flows from all instances
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data.instances?.nodes?.forEach((instance: any) => {
    // Skip if this is the current instance (prevent self-invocation)
    if (
      excludeIntegrationId &&
      instance.integration?.id === excludeIntegrationId
    ) {
      console.log(
        `[Flows] Excluding current instance: ${instance.name} (${instance.integration?.name})`,
      );
      return;
    }

    // Process flow configs for this instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance.flowConfigs?.nodes?.forEach((flowConfig: any) => {
      let schemas;
      try {
        schemas = JSON.parse(flowConfig.flow.schemas);
      } catch (e) {
        console.warn(
          `[Flows] Failed to parse schemas for flow ${flowConfig.flow.name}:`,
          e,
        );
        return;
      }

      // Only include flows with invoke schemas defined
      if (schemas?.invoke) {
        flows.push({
          id: flowConfig.id,
          name: flowConfig.flow.name,
          description: flowConfig.flow.description,
          webhookUrl: flowConfig.webhookUrl,
          inputSchema: {
            ...schemas.invoke,
          },
        });
      }
    });
  });

  return flows;
}

/**
 * Invoke a Prismatic flow via HTTP
 * @param flowConfig - The flow configuration
 * @param args - Arguments to pass to the flow
 * @returns Flow execution result
 */
export async function invokeFlow(
  flowConfig: FlowConfig,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
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
