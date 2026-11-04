import { flow, util } from "@prismatic-io/spectral";
import { ack } from "../util";
import type { BlockAction } from "@slack/bolt";
import {
  parseApprovalAction,
  retrieveStoredAgentState,
  findMatchingApproval,
  createApprovalResponse,
  resumeAgent,
  cleanupStoredState,
  updateApprovalMessage,
} from "../util/approvalHandler";
import { postIncidentResult } from "../util/slackMessageBuilders";

/**
 * Handles Slack events and interactions for the incident management system.
 * This flow processes approval actions from Slack buttons when users decide
 * whether to create an incident from an anomaly alert.
 *
 * Integration flow:
 * 1. newIncidentAlert flow detects anomaly and requests approval
 * 2. User clicks approve/investigate/ignore button in Slack
 * 3. This flow processes the interaction and resumes the AI agent
 * 4. Agent completes the incident creation or rejection
 * 5. Result is posted back to Slack
 */
export const handleSlackEventsAndInteractions = flow({
  name: "Handle Slack Events and Interactions",
  stableKey: "handle-slack-events-and-interactions",
  description: "",
  endpointSecurityType: "customer_optional",
  onTrigger: async (context, payload) => {
    const connection = context.configVars["slackConnection"];
    const signingSecret = util.types.toString(connection.fields.signingSecret);

    const { response, isRetry, retryNum, retryReason } = ack(
      payload,
      signingSecret,
    );

    // Store retry info in execution state
    context.executionState.isRetry = isRetry;
    if (isRetry) {
      context.executionState.retryNum = retryNum;
      context.executionState.retryReason = retryReason;
    }

    // Ack immediately returned to Slack
    return Promise.resolve({
      payload,
      response,
      executionState: context.executionState,
    });
  },
  onExecution: async (context, params) => {
    const triggerResults = params.onTrigger.results.body;

    // Decode the URL-encoded payload from Slack
    const rawBody = util.types.toString(triggerResults.data);
    const formData = new URLSearchParams(rawBody);
    const payloadString = formData.get("payload");

    if (!payloadString) {
      console.log("No payload found in request body");
      return { data: { error: "No payload found" } };
    }

    // Parse the JSON payload
    const interactionPayload = JSON.parse(payloadString) as any;

    console.log(`Received interaction type: ${interactionPayload.type}`);

    // Build response data
    const responseData: any = {
      type: interactionPayload.type,
    };

    // Add common fields
    if (interactionPayload.trigger_id) {
      responseData.trigger_id = interactionPayload.trigger_id;
    }

    if (interactionPayload.user) {
      const userName = interactionPayload.user.username;
      console.log(`User: ${interactionPayload.user.id} (${userName})`);
      responseData.user = interactionPayload.user;
    }

    // Process different interaction types
    switch (interactionPayload.type) {
      case "block_actions": {
        const blockAction = interactionPayload as BlockAction;

        responseData.actions = blockAction.actions;
        responseData.response_url = blockAction.response_url;
        responseData.container = blockAction.container;

        // Process approval action
        const action = blockAction.actions[0];
        console.log(`Processing approval action: ${action.action_id}`);

        // Parse the action value
        const approvalAction = parseApprovalAction(action);
        if (!approvalAction) {
          return { data: { error: "No action value" } };
        }

        const { anomalyId, functionId, approved } = approvalAction;
        console.log(
          `Anomaly ID: ${anomalyId}, Function ID: ${functionId}, Approved: ${approved}`,
        );

        try {
          // Retrieve stored agent state
          const storedState = retrieveStoredAgentState(context, anomalyId);
          if (!storedState) {
            return { data: { error: "Stored state not found" } };
          }

          // Find the matching approval request
          const pendingApprovals = storedState.pendingApprovals || [];
          console.log(`Found ${pendingApprovals.length} pending approvals`);

          const matchingApproval = findMatchingApproval(
            pendingApprovals,
            functionId,
          );
          if (!matchingApproval) {
            return { data: { error: "Approval not found" } };
          }

          // Create approval response
          const approvalResponses = createApprovalResponse(
            functionId,
            approved,
            action.action_id,
          );

          console.log("Resuming agent run...");
          // Resume the agent with approval response
          const resumeResult = await resumeAgent(
            context,
            storedState,
            approvalResponses,
          );

          // Handle the agent's final output
          const finalOutput = resumeResult.data.finalOutput;
          await postIncidentResult(context, finalOutput);

          console.log("Result posted to Slack, updating original message...");
          // Update the original approval message
          await updateApprovalMessage(
            context,
            blockAction,
            approved,
            action.action_id,
          );

          // Clean up stored state
          await cleanupStoredState(context, anomalyId);

          responseData.handled = true;
          responseData.anomalyId = anomalyId;
          responseData.finalOutput = finalOutput;
        } catch (error) {
          console.error("Error handling approval:", error);
          responseData.error =
            error instanceof Error ? error.message : String(error);
        }

        break;
      }

      default:
        console.log("Unsupported interaction type:", interactionPayload);
        responseData.raw = interactionPayload;
    }

    return { data: responseData };
  },
});

export default handleSlackEventsAndInteractions;
