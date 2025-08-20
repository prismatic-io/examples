import { Tool } from "@openai/agents";
import { createOrganizationClient, getAgentFlows } from "../prismatic";
import { createFlowTools } from "./tools/prismaticTools";
import { createHostedTools } from "./tools/openaiHostedTools";
import { createStateStorage, StateStorage } from "./state";
import { createAgent, runAgent, resumeAgentAfterInterruption } from ".";
import { getApprovalTools } from "./tools/approvalTool";
import { AgentRunner, AgentSetupConfig } from "./types";

/**
 * Sets up an agent with tools and storage, returning a runner function
 */
export async function setupAgent(
  config: AgentSetupConfig,
): Promise<AgentRunner> {
  const tools = await buildTools(config);

  const storage = await buildStorage(config);

  const agent = createAgent({
    openAIKey: config.openAIKey,
    systemPrompt: config.systemPrompt,
    tools,
  });

  return {
    run: async (
      message: string,
      conversationId: string,
      previousExecutionId?: string,
    ) => {
      const result = await runAgent(
        agent,
        message,
        storage,
        conversationId,
        previousExecutionId,
      );
      return {
        finalOutput: result.finalOutput,
        needsApproval: result.needsApproval,
      };
    },
    resume: async (
      conversationId: string,
      previousExecutionId: string,
      decision?: { approved: boolean; feedback?: string },
    ) => {
      const result = await resumeAgentAfterInterruption(
        agent,
        storage,
        conversationId,
        previousExecutionId,
        decision,
      );
      return {
        finalOutput: result.finalOutput,
        needsApproval: result.needsApproval,
      };
    },
    storage, // Expose for getLastSavedState()
  };
}

/**
 * Builds the tools array based on configuration
 */
async function buildTools(config: AgentSetupConfig): Promise<Tool[]> {
  let tools: Tool[] = [];

  // Add Prismatic tools if customer is configured
  if (config.customer?.externalId && config.prismaticRefreshToken) {
    console.log(
      "[Agent Setup] Setting up Prismatic tools for Customer",
      config.customer.externalId,
    );

    const orgClient = await createOrganizationClient(
      config.prismaticRefreshToken,
    );
    const flows = await getAgentFlows(
      orgClient,
      config.customer.externalId,
      config.excludeIntegrationId,
    );
    tools = createFlowTools(flows);
  }

  tools = tools.concat(createHostedTools());

  if (config.includeApprovalTools) {
    console.log("[Agent Setup] Adding approval tools for testing");
    tools = tools.concat(getApprovalTools());
  }

  return tools;
}

/**
 * Builds the storage implementation based on configuration
 */
async function buildStorage(config: AgentSetupConfig): Promise<StateStorage> {
  if (config.prismaticRefreshToken) {
    return createStateStorage({
      type: "prismatic",
      client: await createOrganizationClient(config.prismaticRefreshToken),
    });
  }

  // Default to file storage if no Prismatic token
  return createStateStorage({ type: "db" });
}
