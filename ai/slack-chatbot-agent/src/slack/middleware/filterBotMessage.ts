import { Middleware } from "@slack/bolt";

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

export default filterBotMessages;
