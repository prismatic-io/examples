import type { BlockAction } from "@slack/bolt";
import type { IncidentResponseNotification } from "../flows/newIncidentAlert.types";

export interface ApprovalAction {
  anomalyId: string;
  functionId: string;
  approved: boolean;
}

export interface StoredAgentState {
  state: string;
  pendingApprovals: Array<{
    approvalRequest?: {
      functionId: string;
    };
  }>;
  agentConfig: string;
  hasInterruptions: boolean;
}

/**
 * Parse the approval action value from Slack button interaction
 * Format: "anomaly_id:function_id:approved"
 */
export function parseApprovalAction(action: any): ApprovalAction | null {
  const actionValue = "value" in action ? action.value : "";
  if (!actionValue) {
    console.error("No value found in action");
    return null;
  }

  const [anomalyId, functionId, approvedStr] = actionValue.split(":");
  return {
    anomalyId,
    functionId,
    approved: approvedStr === "true",
  };
}

/**
 * Retrieve stored agent state from cross-flow storage
 */
export function retrieveStoredAgentState(
  context: any,
  anomalyId: string,
): StoredAgentState | null {
  const storedState = context.crossFlowState[anomalyId] as StoredAgentState;

  console.log("Stored State: ", storedState);
  if (!storedState) {
    console.error(`No stored state found for anomaly ID: ${anomalyId}`);
    return null;
  }

  return storedState;
}

/**
 * Find matching approval request in pending approvals
 */
export function findMatchingApproval(
  pendingApprovals: any[],
  functionId: string,
): any | null {
  const matchingApproval = pendingApprovals.find(
    (approval: any) => approval.approvalRequest?.functionId === functionId,
  );

  if (!matchingApproval) {
    console.error(`No matching approval found for functionId: ${functionId}`);
    return null;
  }

  return matchingApproval;
}

/**
 * Create approval response for agent resumption
 */
export function createApprovalResponse(
  functionId: string,
  approved: boolean,
  actionId: string,
): Array<{
  functionId: string;
  approved: boolean;
  feedback: string | null;
}> {
  const feedback =
    actionId === "investigate_alert"
      ? "User chose to investigate first"
      : actionId === "ignore_alert"
        ? "User chose to ignore alert"
        : null;

  return [
    {
      functionId,
      approved,
      feedback,
    },
  ];
}

/**
 * Resume agent with approval response
 */
export async function resumeAgent(
  context: any,
  storedState: StoredAgentState,
  approvalResponses: any,
): Promise<{ data: { finalOutput: IncidentResponseNotification } }> {
  const resumeResult = await context.components.openai.resumeRun({
    state: storedState.state,
    agentConfig: storedState.agentConfig as string,
    openaiConnection: context.configVars["OpenAI Connection"],
    approvalResponses: approvalResponses as any,
  });

  console.log("Agent resumed, processing final output...");
  return resumeResult as { data: { finalOutput: IncidentResponseNotification } };
}

/**
 * Clean up stored state after processing
 */
export async function cleanupStoredState(
  context: any,
  anomalyId: string,
): Promise<void> {
  await context.components.persistData.removeCrossFlowValue({
    keyInput: anomalyId,
  });
}

/**
 * Update the original approval message to show it's been handled
 */
export async function updateApprovalMessage(
  context: any,
  blockAction: BlockAction,
  approved: boolean,
  actionId: string,
): Promise<void> {
  const updateText = approved
    ? `✅ Incident created by <@${blockAction.user.id}>`
    : actionId === "investigate_alert"
      ? `🔍 Under investigation by <@${blockAction.user.id}>`
      : `🔕 Ignored by <@${blockAction.user.id}>`;

  await context.components.slack.updateMessage({
    connection: context.configVars["slackConnection"],
    messageId: blockAction.container.message_ts,
    channelId: blockAction.container.channel_id,
    message: updateText,
  });
}