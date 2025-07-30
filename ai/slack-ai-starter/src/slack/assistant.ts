import { Assistant } from "@slack/bolt";
import {
  runAgentWithDebug,
  createAgent,
  runAgent,
} from "../agents/agentFactory";
import {
  AgentInputItem,
  user as userMessage,
  assistant as assistantMessage,
} from "@openai/agents";
import { AgentConfiguration } from "../types/config.types";

export interface AssistantConfig {
  agent?: AgentConfiguration;
}

export async function createAssistant(
  config: AssistantConfig,
): Promise<Assistant> {
  const agent = await createAgent(config.agent);
  const assistant = new Assistant({
    /**
     * (Recommended) A custom ThreadContextStore can be provided, inclusive of methods to
     * get and save thread context. When provided, these methods will override the `getThreadContext`
     * and `saveThreadContext` utilities that are made available in other Assistant event listeners.
     */
    threadContextStore: {
      get: async ({ context, client, payload, logger }) => {
        logger.debug("Getting thread context");
        return {};
      },
      save: async ({ context, client, payload, logger }) => {
        logger.debug("Saving thread context");
      },
    },

    /**
     * `assistant_thread_started` is sent when a user opens the Assistant container.
     * This can happen via DM with the app or as a side-container within a channel.
     *
     * @see {@link https://docs.slack.dev/reference/events/assistant_thread_started}
     */
    threadStarted: async ({
      event,
      logger,
      say,
      setSuggestedPrompts,
      saveThreadContext,
    }) => {
      const { context } = event.assistant_thread;

      try {
        /**
         * Since context is not sent along with individual user messages, it's necessary to keep
         * track of the context of the conversation to better assist the user. Sending an initial
         * message to the user with context metadata facilitates this, and allows us to update it
         * whenever the user changes context (via the `assistant_thread_context_changed` event).
         * The `say` utility sends this metadata along automatically behind the scenes.
         * !! Please note: this is only intended for development and demonstrative purposes.
         */
        await say("Hi, how can I help?");

        await saveThreadContext();

        /**
         * Provide the user up to 4 optional, preset prompts to choose from.
         *
         * The first `title` prop is an optional label above the prompts that
         * defaults to 'Try these prompts:' if not provided.
         *
         * @see {@link https://docs.slack.dev/reference/methods/assistant.threads.setSuggestedPrompts}
         */
        if (!context.channel_id) {
          await setSuggestedPrompts({
            title: "Start with this suggested prompt:",
            prompts: [
              {
                title: "This is a suggested prompt",
                message:
                  "When a user clicks a prompt, the resulting prompt message text " +
                  "can be passed directly to your LLM for processing.\n\n" +
                  "Assistant, please create some helpful prompts I can provide to " +
                  "my users.",
              },
            ],
          });
        }

        /**
         * If the user opens the Assistant container in a channel, additional
         * context is available. This can be used to provide conditional prompts
         * that only make sense to appear in that context.
         */
        if (context.channel_id) {
          await setSuggestedPrompts({
            title: "Perform an action based on the channel",
            prompts: [
              {
                title: "Summarize channel",
                message:
                  "Assistant, please summarize the activity in this channel!",
              },
            ],
          });
        }
      } catch (e) {
        logger.error(e);
      }
    },

    /**
     * `assistant_thread_context_changed` is sent when a user switches channels
     * while the Assistant container is open. If `threadContextChanged` is not
     * provided, context will be saved using the AssistantContextStore's `save`
     * method (either the DefaultAssistantContextStore or custom, if provided).
     *
     * @see {@link https://docs.slack.dev/reference/events/assistant_thread_context_changed}
     */
    threadContextChanged: async ({ logger, saveThreadContext }) => {
      // const { channel_id, thread_ts, context: assistantContext } = event.assistant_thread;
      try {
        await saveThreadContext();
      } catch (e) {
        logger.error(e);
      }
    },

    /**
     * Messages sent from the user to the Assistant are handled in this listener.
     *
     * @see {@link https://docs.slack.dev/reference/events/message}
     */
    userMessage: async ({
      client,
      logger,
      message,
      getThreadContext,
      say,
      setTitle,
      setStatus,
    }) => {
      /**
       * Messages sent to the Assistant can have a specific message subtype.
       *
       * Here we check that the message has "text" and was sent to a thread to
       * skip unexpected message subtypes.
       *
       * @see {@link https://docs.slack.dev/reference/events/message#subtypes}
       */
      if (
        !("text" in message) ||
        !("thread_ts" in message) ||
        !message.text ||
        !message.thread_ts
      ) {
        return;
      }

      const { channel, thread_ts } = message;
      logger.info("Received message for channel and thread", {
        channel,
        thread_ts,
      });
      try {
        /**
         * Set the title of the Assistant thread to capture the initial topic/question
         * as a way to facilitate future reference by the user.
         *
         * @see {@link https://docs.slack.dev/reference/methods/assistant.threads.setTitle}
         */
        await setTitle(message.text);

        /**
         * Set the status of the Assistant to give the appearance of active processing.
         *
         * @see {@link https://docs.slack.dev/reference/methods/assistant.threads.setStatus}
         */
        await setStatus("is typing..");

        // Retrieve the Assistant thread history for context of question being asked
        const thread = await client.conversations.replies({
          channel,
          ts: thread_ts,
          oldest: thread_ts,
          limit: 20, // Increase limit to get full conversation
        });

        const history: AgentInputItem[] = [];
        if (thread.messages && thread.messages.length > 0) {
          // Skip the first message (parent) and exclude the current message
          const messagesToProcess = thread.messages.slice(1, -1);

          for (const m of messagesToProcess) {
            if (!m.text) continue;

            const role = m.bot_id ? "assistant" : "user";
            if (role === "user") {
              history.push(userMessage(m.text));
            } else {
              history.push(assistantMessage(m.text));
            }
          }
        }

        // Add the current user message
        history.push(userMessage(message.text));

        const response = await runAgent(agent, history);
        // Provide a response to the user
        await say({ text: response! });
      } catch (e) {
        logger.error(e);

        // Send message to advise user and clear processing status if a failure occurs
        await say({ text: "Sorry, something went wrong!" });
      }
    },
  });
  return assistant;
}
