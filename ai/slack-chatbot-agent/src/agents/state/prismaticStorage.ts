import { getStepResult } from "../../prismatic/api/executions";
import { OrganizationClient, CustomerClient } from "../../prismatic/types";
import { AgentState, StateStorage } from "./types";

export class PrismaticStorage implements StateStorage {
  private lastSavedState: AgentState | null = null;

  constructor(private client: OrganizationClient | CustomerClient) {}

  async save(state: AgentState): Promise<void> {
    // Store the state to be included in flow's return value
    // Platform will persist this to S3 via the onExecution return
    this.lastSavedState = state;
    console.log(
      `[PrismaticStorage] State queued for persistence for conversation ${state.conversationId}`,
    );
  }

  getLastSavedState(): AgentState | null {
    return this.lastSavedState;
  }

  async load(
    conversationId: string,
    previousExecutionId?: string,
  ): Promise<AgentState | null> {
    if (!previousExecutionId) {
      console.log(
        `[PrismaticStorage] No previous execution ID provided for conversation ${conversationId}`,
      );
      return null;
    }

    try {
      console.log(
        `[PrismaticStorage] Loading state from execution ${previousExecutionId}`,
      );

      // Fetch previous execution's onExecution output
      const result = await getStepResult(
        this.client,
        previousExecutionId,
        "onExecution",
      );
      // Extract agentState from the result
      const agentState = result?.data?.agentState;
      if (agentState) {
        console.log(
          `[PrismaticStorage] Loaded state for conversation ${conversationId}`,
        );
        return agentState;
      }

      console.log(
        `[PrismaticStorage] No agent state found in previous execution`,
      );
      return null;
    } catch (error) {
      console.error(`[PrismaticStorage] Failed to load previous state:`, error);
      return null;
    }
  }
}
