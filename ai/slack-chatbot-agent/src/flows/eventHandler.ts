import { flow, util } from "@prismatic-io/spectral";
import { Assistant } from "@slack/bolt";
import { ack } from "../slack/acknowledge";
import { App, ActionHandlers } from "../slack/app";
import { findPreviousExecutionId } from "../slack/util";
import { setupAgent } from "../agents/setup";
import { createApprovalBlocks } from "../slack/blocks/approvalBlocks";

export const eventHandler = flow({
  name: "Slack Message Handler",
  stableKey: "slack-event-handler",
  description:
    "Handles Slack Events and generates responses with OpenAI Assistant SDK",
  onTrigger: async (context, payload) => {
    const connection = context.configVars["Slack Connection"];
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
    const { configVars, customer, integration } = context;

    // Check if this is a retry and skip processing
    if (context.executionState.isRetry) {
      console.log("[Flow] Skipping retry event processing");
      return {
        data: {
          result: "Skipped - retry event",
          agentState: null,
        },
      };
    }

    const connection = configVars["Slack Connection"];
    const openaiConnection = util.types.toString(
      configVars.OPENAI_API_KEY.fields.apiKey,
    );
    const prismaticRefreshToken = util.types.toString(
      configVars.PRISMATIC_REFRESH_TOKEN,
    );

    const agentRunner = await setupAgent({
      openAIKey: openaiConnection,
      systemPrompt: configVars.SYSTEM_PROMPT,
      customer:
        customer.externalId !== "testCustomerExternalId" ? customer : undefined,
      prismaticRefreshToken,
      includeApprovalTools: true, // Enable approval tools for testing
      excludeIntegrationId: integration.id,
    });

    const executionId = params.onTrigger.results.executionId;

    // Create slack assistant
    const assistant = new Assistant({
      userMessage: async (args) => {
        const { client, message, logger, setStatus } = args;
        if (
          !("text" in message) ||
          !("thread_ts" in message) ||
          !message.text ||
          !message.thread_ts
        ) {
          return;
        }

        setStatus("is typing...");

        const conversationId = message.thread_ts;
        const userInput = message.text;

        try {
          const previousExecutionId = await findPreviousExecutionId(
            client,
            message.channel,
            message.thread_ts,
          );

          const result = await agentRunner.run(
            userInput,
            conversationId,
            previousExecutionId,
          );

          if (result.needsApproval) {
            const state = agentRunner.storage.getLastSavedState();
            if (!state?.pendingApproval) {
              throw new Error("No agent state found for approval handling.");
            }

            await client.chat.postMessage({
              channel: message.channel,
              thread_ts: message.thread_ts,
              blocks: createApprovalBlocks(
                state.pendingApproval.toolName,
                state.pendingApproval.arguments,
                executionId,
              ),
              text: `Approval required for tool: ${state.pendingApproval.toolName}`,
            });
          } else {
            await client.chat.postMessage({
              channel: message.channel,
              thread_ts: message.thread_ts,
              text: result?.finalOutput || "Something went wrong",
              metadata: {
                event_type: "execution_id",
                event_payload: { execution_id: executionId },
              },
            });
          }
        } catch (e) {
          logger.error("[Assistant] Error:", e);
          await args.say({
            text: "I encountered an error processing your request. Please try again.",
          });
        }
      },

      threadStarted: async (args) => {
        await args.say("Hi! I'm your AI assistant. How can I help you today?");
        await args.saveThreadContext();
      },
    });

    const actionHandlers: ActionHandlers = {
      onToolApproval: async ({
        approved,
        previousExecutionId,
        userId,
        conversationId,
        channelId,
        client,
        updateMessage,
      }) => {
        await updateMessage(
          approved
            ? `✅ Tool execution approved by <@${userId}>`
            : `❌ Tool execution denied by <@${userId}>`,
        );

        try {
          console.log(
            `[Action Handler] Resuming agent with ${approved ? "approval" : "denial"} for execution ${previousExecutionId}`,
          );
          const result = await agentRunner.resume(
            conversationId,
            previousExecutionId,
            { approved },
          );

          if (result.needsApproval) {
            const state = agentRunner.storage.getLastSavedState();
            if (state?.pendingApproval) {
              await client.chat.postMessage({
                channel: channelId,
                thread_ts: conversationId,
                blocks: createApprovalBlocks(
                  state.pendingApproval.toolName,
                  state.pendingApproval.arguments,
                  executionId,
                ),
                text: `Another approval required: ${state.pendingApproval.toolName}`,
              });
            }
          } else {
            await client.chat.postMessage({
              channel: channelId,
              thread_ts: conversationId,
              text: result?.finalOutput || "Something went wrong",
              metadata: {
                event_type: "execution_id",
                event_payload: {
                  execution_id: executionId,
                },
              },
            });
          }
        } catch (error) {
          console.error("[Action Handler] Error:", error);
          await client.chat.postMessage({
            channel: conversationId,
            thread_ts: conversationId,
            text: `❌ Error processing approval: ${(error as Error).message}`,
          });
        }
      },
    };

    const app = App(connection, { assistant, actionHandlers });
    const handler = await app.start();
    await handler(params.onTrigger.results);

    return {
      data: {
        agentState: agentRunner.storage.getLastSavedState(),
      },
    };
  },
});

export default eventHandler;
