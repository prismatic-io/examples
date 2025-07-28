/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogLevel } from "@slack/web-api";
import { Connection, util } from "@prismatic-io/spectral";
import { App as SlackApp, Middleware, Assistant } from "@slack/bolt";
import { PrismaticWebhookReceiver } from "./webhookReceiver";

// Custom middleware to filter bot messages
const filterBotMessages: Middleware<any> = async ({
  message,
  next,
  logger,
}) => {
  // Log all incoming messages for debugging
  logger.info("Incoming message event:", {
    user: message?.user,
    bot_id: message?.bot_id,
    subtype: message?.subtype,
    text: message?.text?.substring(0, 50) + "...",
    channel: message?.channel,
    ts: message?.ts,
  });

  // Filter out bot messages
  if (message?.bot_id || message?.subtype === "bot_message") {
    return;
  }

  await next();
};

export interface AppOptions {
  assistant?: Assistant;
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
    signingSecret: util.types.toString(connection.fields.signingSecret),
    logLevel: process.env.DEBUG === "true" ? LogLevel.DEBUG : LogLevel.INFO,
    ignoreSelf: true, // Built-in middleware to ignore own bot events
    processBeforeResponse: false,
    receiver,
  });

  app.use(filterBotMessages);

  if (options?.assistant) {
    app.assistant(options.assistant);
  }

  // Initialize the receiver with the app
  receiver.init(app);

  return receiver;
}
