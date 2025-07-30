import { LogLevel, WebClient } from "@slack/web-api";
import { Connection, util } from "@prismatic-io/spectral";
import { App as SlackApp, Assistant } from "@slack/bolt";
import { PrismaticWebhookReceiver } from "./webhookReceiver";
import filterBotMessages from "./middleware/filterBotMessage";
export interface ToolApprovalArgs {
  approved: boolean;
  previousExecutionId: string;
  userId: string;
  conversationId: string;
  channelId: string;
  client: WebClient;
  updateMessage: (text: string) => Promise<void>;
}

export interface ActionHandlers {
  onToolApproval?: (args: ToolApprovalArgs) => Promise<void>;
  // onHomeTab?: (args: any) => Promise<void>;
  // onShortcut?: (args: any) => Promise<void>;
  // onCommand?: (args: any) => Promise<void>;
}

export interface AppOptions {
  assistant?: Assistant;
  actionHandlers?: ActionHandlers;
}

export function App(
  connection: Connection,
  options?: AppOptions,
): PrismaticWebhookReceiver {
  if (!connection.token?.access_token) {
    throw new Error(
      "No valid auth token provided. Please check your connection",
    );
  }

  // Create receiver to convert webhooks to Slack Events
  const receiver = new PrismaticWebhookReceiver();

  const app = new SlackApp({
    token: util.types.toString(connection.token.access_token),
    logLevel: process.env.DEBUG === "true" ? LogLevel.DEBUG : LogLevel.INFO,
    ignoreSelf: true, // Built-in middleware to ignore own bot events
    processBeforeResponse: false,
    receiver,
  });

  app.use(filterBotMessages);

  if (options?.assistant) {
    app.assistant(options.assistant);
  }

  if (options?.actionHandlers?.onToolApproval) {
    const toolApprovalHandler = options.actionHandlers.onToolApproval;

    app.action(/^(approve|deny)_tool_.*/, async ({ ack, body, client }) => {
      // Fixme: Narrow types for the type of action we're targeting
      const actionBody = body as any;

      const actionId = actionBody.actions[0].action_id;
      const [decision, , previousExecutionId] = actionId.split("_");
      const approved = decision === "approve";
      const userId = actionBody.user.id;
      const conversationId = actionBody.message.thread_ts;

      console.log(
        `[Approval Action] User ${userId} ${decision}d tool for execution ${previousExecutionId}`,
      );

      // Call the handler with all context
      await toolApprovalHandler({
        approved,
        previousExecutionId,
        userId,
        conversationId,
        channelId: actionBody.channel.id,
        client,
        updateMessage: async (text: string) => {
          await client.chat.update({
            channel: actionBody.channel.id,
            ts: actionBody.message.ts,
            blocks: [],
            text,
          });
        },
      });
    });
  }

  receiver.init(app);

  return receiver;
}
