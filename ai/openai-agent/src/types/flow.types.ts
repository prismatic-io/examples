import { AgentState } from "../agents/state";

export interface ApprovalDecision {
  approved: boolean;
  feedback?: string;
}

export interface FlowInput {
  conversationId: string;
  message: string | null;
  previousExecutionId?: string;
  approval?: ApprovalDecision;
  metadata?: Record<string, any>;
}

export interface FlowOutput {
  agentState: AgentState | null;
  executionId: string;
}