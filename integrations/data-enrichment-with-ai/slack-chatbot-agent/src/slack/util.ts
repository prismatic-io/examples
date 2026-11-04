import { WebClient } from "@slack/web-api";

/**
 * Find the previous execution ID from the most recent bot message in the thread
 */
export async function findPreviousExecutionId(
  client: WebClient,
  channel: string,
  thread_ts: string,
): Promise<string | undefined> {
  const thread = await client.conversations.replies({
    channel,
    ts: thread_ts,
    oldest: thread_ts,
    limit: 100, // Get up to 100 messages (reasonable for assistant threads)
    include_all_metadata: true,
  });

  if (!thread.messages || thread.messages.length <= 2) {
    return undefined; // No history beyond parent and current
  }

  // Get all messages except parent (first) and current (last)
  const historicalMessages = thread.messages.slice(1, -1);

  // Take only the last 10 messages to search for execution ID (most recent)
  const recentMessages = historicalMessages.slice(-10);

  // Find most recent bot message with execution metadata
  const botMessageWithMetadata = recentMessages
    .reverse()
    .find((m: any) => m.bot_id && m.metadata?.event_type === "execution_id");

  const executionId = botMessageWithMetadata
    ? (botMessageWithMetadata as any).metadata?.event_payload?.execution_id
    : undefined;

  if (executionId) {
    console.log(`[Assistant] Found previous execution ID: ${executionId}`);
  }

  return executionId;
}
