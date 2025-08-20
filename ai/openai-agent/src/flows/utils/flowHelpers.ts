import { FlowInput, FlowOutput, ApprovalDecision } from "../../types/flow.types";
import { AgentState } from "../../agents/state";

export function parseFlowInput(data: any): FlowInput {
  if (!data) {
    throw new Error("Missing input data");
  }

  const conversationId = data.conversationId;
  if (!conversationId) {
    throw new Error("conversationId is required");
  }

  const message = data.message !== undefined ? data.message : null;
  const previousExecutionId = data.previousExecutionId;
  const metadata = data.metadata || {};

  let approval: ApprovalDecision | undefined;
  if (data.approval || (data.approved !== undefined)) {
    approval = data.approval || {
      approved: data.approved,
      feedback: data.feedback
    };
  }

  return {
    conversationId,
    message,
    previousExecutionId,
    approval,
    metadata
  };
}

export function buildFlowOutput(
  state: AgentState | null,
  executionId: string
): FlowOutput {
  return {
    agentState: state,
    executionId
  };
}

export function isApprovalInput(input: FlowInput): boolean {
  return input.approval !== undefined && input.message === null;
}

export function generateConversationId(
  prefix: string,
  executionId: string
): string {
  return `${prefix}-${executionId}`;
}