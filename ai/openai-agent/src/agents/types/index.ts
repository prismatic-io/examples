import { Tool } from "@openai/agents";
import { StateStorage } from "../state";

export interface AgentConfiguration {
  systemPrompt: string;
  openAIKey: string;
  tools?: Tool[];
}

export interface AgentSetupConfig {
  openAIKey: string;
  systemPrompt: string;
  tools: Tool[];  // Direct array of tools - explicit and clear
}

export interface AgentRunner {
  run: (
    message: string,
    conversationId: string,
    previousExecutionId?: string,
  ) => Promise<{
    finalOutput: string | null;
    needsApproval?: boolean;
  }>;
  /**
   * Resume an interrupted agent run after receiving approval decision
   * @param conversationId - The conversation ID
   * @param previousExecutionId - The execution ID of the interrupted run
   * @param decision - The approval decision (defaults to approved if not specified)
   */
  resume: (
    conversationId: string,
    previousExecutionId: string,
    decision?: {
      approved: boolean;
      feedback?: string;
    },
  ) => Promise<{
    finalOutput: string | null;
    needsApproval?: boolean;
  }>;
  storage: StateStorage;
}
