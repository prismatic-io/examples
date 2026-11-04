import { Tool, tool } from "@openai/agents";
import { FlowConfig } from "../../prismatic/types";
import { invokeFlow, getAgentFlows } from "../../prismatic/api";
import { createOrganizationClient } from "../../prismatic";

/**
 * Create Prismatic tools dynamically based on available flows
 * @param customerExternalId - The customer's external ID
 * @param excludeIntegrationId - Optional integration ID to exclude (prevents self-invocation)
 * @returns Array of OpenAI agent tool definitions for Prismatic flows
 */
export async function createPrismaticTools(
  customerExternalId: string,
  excludeIntegrationId?: string,
): Promise<Tool[]> {
  const refreshToken = process.env.PRISMATIC_REFRESH_TOKEN;
  
  if (!refreshToken) {
    console.log("[Prismatic Tools] No PRISMATIC_REFRESH_TOKEN found in environment, skipping Prismatic tools");
    return [];
  }
  
  try {
    console.log(`[Prismatic Tools] Creating tools for customer: ${customerExternalId}`);
    
    const orgClient = await createOrganizationClient(refreshToken);
    const flows = await getAgentFlows(
      orgClient,
      customerExternalId,
      excludeIntegrationId,
    );
    
    console.log(`[Prismatic Tools] Found ${flows.length} flows to convert to tools`);
    return createFlowTools(flows);
  } catch (error) {
    console.error("[Prismatic Tools] Error creating Prismatic tools:", error);
    return [];
  }
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async execute(args: any) {
        return await invokeFlow(flow, args);
      },
    }),
  );
}
