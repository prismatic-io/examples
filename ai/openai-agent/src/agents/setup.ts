import { createOrganizationClient } from "../prismatic";
import { createStateStorage, StateStorage } from "./state";
import { createAgent, runAgent, resumeAgentAfterInterruption } from ".";
import { AgentRunner, AgentSetupConfig } from "./types";

/**
 * Sets up an agent with tools and storage, returning a runner function
 */
export async function setupAgent(
  config: AgentSetupConfig,
): Promise<AgentRunner> {
  const storage = await buildStorage();

  const agent = createAgent({
    openAIKey: config.openAIKey,
    systemPrompt: config.systemPrompt,
    tools: config.tools,
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
 * Builds the storage implementation based on environment configuration
 */
async function buildStorage(): Promise<StateStorage> {
  const refreshToken = process.env.PRISMATIC_REFRESH_TOKEN;
  
  if (refreshToken) {
    return createStateStorage({
      type: "prismatic",
      client: await createOrganizationClient(refreshToken),
    });
  }

  // Default to file storage if no Prismatic token
  return createStateStorage({ type: "db" });
}
