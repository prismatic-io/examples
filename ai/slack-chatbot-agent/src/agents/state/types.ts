import { AgentInputItem } from "@openai/agents";

export interface AgentState {
  conversationId: string;
  runState?: string; // Serialized RunState for interruptions
  history: AgentInputItem[]; // For simple conversation continuity
  metadata?: {
    lastExecutionId?: string;
    timestamp: number;
    interrupted?: boolean;
  };
  // Fields for handling approval flow
  pendingApproval?: {
    toolName: string;
    arguments: any;
    messageTs?: string; // Slack message timestamp with approval buttons
  };
}

export interface StateStorage {
  save(state: AgentState): Promise<void>;
  load(
    conversationId: string,
    previousExecutionId?: string,
  ): Promise<AgentState | null>;
  getLastSavedState(): AgentState | null;
}
