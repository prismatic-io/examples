import { CustomerAttributes, flow, util } from "@prismatic-io/spectral";
import { Assistant } from "@slack/bolt";
import {
  Agent,
  run,
  RunState,
  setDefaultOpenAIKey,
  user,
  Tool,
} from "@openai/agents";
import { ack } from "../slack/acknowledge";
import { App, ActionHandlers } from "../slack/app";
import { createApprovalBlocks } from "../slack/blocks/approvalBlocks";
import { createOrganizationClient, getAgentFlows } from "../prismatic";
import {
  createFlowTools,
  getApprovalTools,
} from "../agents/tools/prismaticTools";
import { createHostedTools } from "../agents/tools/openaiHostedTools";
import { ConversationState } from "../types";

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
    const { configVars, customer, integration, instanceState } = context;

    // Check if this is a retry and skip processing
    if (context.executionState.isRetry) {
      console.log("[Flow] Skipping retry event processing");
      return {
        data: {
          result: "Skipped - retry event",
        },
      };
    }

    const connection = configVars["Slack Connection"];
    const openaiKey = util.types.toString(
      configVars.OPENAI_API_KEY.fields.apiKey,
    );
    const prismaticRefreshToken = util.types.toString(
      configVars.PRISMATIC_REFRESH_TOKEN,
    );

    // Set OpenAI API key globally
    setDefaultOpenAIKey(openaiKey);

    // Build tools directly
    const tools = await buildTools(
      customer.externalId !== "testCustomerExternalId" ? customer : undefined,
      prismaticRefreshToken,
      integration.id,
    );

    // Create agent directly - no abstractions
    const agent = new Agent({
      name: "Slack Assistant",
      instructions: configVars.SYSTEM_PROMPT,
      tools,
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
          // Get stored state for this conversation
          const convState = (instanceState[conversationId] ||
            {}) as ConversationState;
          const lastResponseId = convState.lastResponseId;

          // Run the agent with the message
          const result = await run(agent, [user(userInput)], {
            previousResponseId: lastResponseId,
          });

          // Handle interruptions
          if (result.interruptions && result.interruptions.length > 0) {
            const firstInterruption = result.interruptions[0];

            // Store state in instanceState
            instanceState[conversationId] = {
              state: result.state.toString(),
              lastResponseId: result.lastResponseId,
              pendingInterruption: {
                functionId: firstInterruption.rawItem.id!,
                name: firstInterruption.rawItem.name,
                arguments: firstInterruption.rawItem.arguments,
              },
            } as ConversationState;

            // Post approval block
            await client.chat.postMessage({
              channel: message.channel,
              thread_ts: message.thread_ts,
              blocks: createApprovalBlocks(
                firstInterruption.rawItem.name,
                firstInterruption.rawItem.arguments,
                executionId,
              ),
              text: `Approval required for tool: ${firstInterruption.rawItem.name}`,
              metadata: {
                event_type: "tool_approval",
                event_payload: { conversationId },
              },
            });
          } else {
            // Store lastResponseId for next message
            instanceState[conversationId] = {
              lastResponseId: result.lastResponseId,
            } as ConversationState;

            // Post response
            await client.chat.postMessage({
              channel: message.channel,
              thread_ts: message.thread_ts,
              text: result.finalOutput || "I couldn't generate a response.",
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
        try {
          // Get stored state for this conversation
          const convState = instanceState[conversationId] as ConversationState;
          if (!convState?.state) {
            await updateMessage(
              "❌ Approval state expired. Please start over.",
            );
            return;
          }

          // Deserialize and apply decision
          let agentState = await RunState.fromString(agent, convState.state);
          const interrupts = agentState.getInterruptions();
          const interrupt = interrupts[0];

          if (!interrupt) {
            await updateMessage("❌ No pending approval found.");
            return;
          }

          if (approved) {
            agentState.approve(interrupt);
          } else {
            agentState.reject(interrupt);
          }

          // Update message to show decision
          await updateMessage(
            approved
              ? `✅ Tool execution approved by <@${userId}>`
              : `❌ Tool execution denied by <@${userId}>`,
          );

          // Continue execution
          const result = await run(agent, agentState);

          // Handle next interruption or final response
          if (result.interruptions && result.interruptions.length > 0) {
            const nextInterruption = result.interruptions[0];

            // Store next state
            instanceState[conversationId] = {
              state: result.state.toString(),
              lastResponseId: result.lastResponseId,
              pendingInterruption: {
                functionId: nextInterruption.rawItem.id!,
                name: nextInterruption.rawItem.name,
                arguments: nextInterruption.rawItem.arguments,
              },
            } as ConversationState;

            // Post next approval
            await client.chat.postMessage({
              channel: channelId,
              thread_ts: conversationId,
              blocks: createApprovalBlocks(
                nextInterruption.rawItem.name,
                nextInterruption.rawItem.arguments,
                executionId,
              ),
              text: `Another approval required: ${nextInterruption.rawItem.name}`,
              metadata: {
                event_type: "tool_approval",
                event_payload: { conversationId },
              },
            });
          } else {
            // Store only lastResponseId for future messages
            instanceState[conversationId] = {
              lastResponseId: result.lastResponseId,
            } as ConversationState;

            // Post final response
            await client.chat.postMessage({
              channel: channelId,
              thread_ts: conversationId,
              text: result.finalOutput || "Task completed.",
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
            channel: channelId,
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
        result: "Event processed successfully",
      },
    };
  },
});

/**
 * Build tools array based on configuration
 */
async function buildTools(
  customer?: CustomerAttributes,
  prismaticRefreshToken?: string,
  excludeIntegrationId?: string,
): Promise<Tool[]> {
  let tools: Tool[] = [];

  // Add Prismatic tools if configured
  if (customer?.externalId && prismaticRefreshToken) {
    console.log(
      "[Tools] Setting up Prismatic tools for Customer",
      customer.externalId,
    );

    const orgClient = await createOrganizationClient(prismaticRefreshToken);
    const flows = await getAgentFlows(
      orgClient,
      customer.externalId,
      excludeIntegrationId,
    );
    tools = createFlowTools(flows);
  }

  // Add hosted tools
  tools = tools.concat(createHostedTools());
  tools = tools.concat(getApprovalTools());

  return tools;
}

export default eventHandler;
