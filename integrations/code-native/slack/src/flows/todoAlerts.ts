/**
 * This flow has similar functionality to the low-code "Build Your First Integration" tutorial
 * from the Prismatic documentation. It fetches TODO items from an Acme API and sends incomplete
 * items to a Slack channel of the user's choosing.
 *
 * https://prismatic.io/docs/getting-started/first-integration/build-first-integration/
 */

import { flow } from "@prismatic-io/spectral";
import { createAcmeClient } from "../acmeClient";
import { createSlackClient } from "../slackClient";

interface TodoItem {
  id: number;
  completed: boolean;
  title: string;
}

export const todoAlertsFlow = flow({
  name: "Send TODO messages to Slack",
  stableKey: "slack-todo-alerts-flow",
  description: "Fetch TODO items from Acme and send to Slack",
  // This flow is triggered on a schedule of the user's choosing
  schedule: { configVar: "Todo Schedule" },
  // This function runs when the trigger has completed its work
  onExecution: async ({ logger, configVars }) => {
    // Create authenticated clients for Slack and Acme
    const slackClient = createSlackClient(configVars["Slack Connection"]);
    const acmeClient = createAcmeClient(configVars["Acme Connection"]);

    // Group logs into sections so they're easier to follow in the Prismatic app.
    // Data passed to `sectionEnd` is attached to the section for debugging.
    logger.section("Fetch TODO items");
    // Make an HTTP request to the Acme API using the config variable
    const { data: todoItems } = await acmeClient.get<TodoItem[]>("/todos", {
      params: { _limit: 10 },
    });
    logger.info(`Fetched ${todoItems.length} TODO items from Acme`);
    logger.sectionEnd({ label: "Fetch TODO items", data: { todoItems } });

    logger.section("Send Slack messages");
    const skippedItemIds: number[] = [];
    const sentItemIds: number[] = [];
    // Loop over the todo items
    for (const item of todoItems) {
      if (item.completed) {
        logger.info(`Skipping completed item ${item.id}`);
        skippedItemIds.push(item.id);
      } else {
        // Send a message to the Slack channel for each incomplete item
        logger.info(`Sending message for item ${item.id}`);
        try {
          await slackClient.post("chat.postMessage", {
            channel: configVars["Select Slack Channel"],
            text: `Incomplete task: ${item.title}`,
          });
        } catch (e) {
          throw new Error(`Failed to send message for item ${item.id}: ${e}`);
        }
        sentItemIds.push(item.id);
      }
    }
    logger.sectionEnd({
      label: "Send Slack messages",
      data: { sentItemIds, skippedItemIds },
    });

    // Asynchronously-invoked flows should simply return null
    return { data: null };
  },
});

export default todoAlertsFlow;
