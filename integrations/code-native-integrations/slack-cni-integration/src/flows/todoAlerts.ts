/**
 * This flow has similar functionality to the low-code "Build Your First Integration" tutorial
 * from the Prismatic documentation. It fetches TODO items from an Acme API and sends incomplete
 * items to a Slack channel of the user's choosing.
 *
 * https://prismatic.io/docs/getting-started/first-integration/build-first-integration/
 */

import { flow } from "@prismatic-io/spectral";
import axios from "axios";
import { createSlackClient } from "../slackClient";

interface TodoItem {
  id: number;
  completed: boolean;
  task: string;
}

export const todoAlertsFlow = flow({
  name: "Send TODO messages to Slack",
  stableKey: "slack-todo-alerts-flow",
  description: "Fetch TODO items from Acme and send to Slack",
  // This trigger function is simple - it just returns the payload it receives
  onTrigger: async (context, payload) => {
    return Promise.resolve({ payload });
  },
  // This function runs when the trigger has completed its work
  onExecution: async (context) => {
    // Config variables are accessed using the context object
    const { logger, configVars } = context;

    // Make an HTTP request to the Acme API using the config variable
    const { data: todoItems } = await axios.get<TodoItem[]>(
      configVars["Acme API Endpoint"]
    );

    // Create an HTTP Slack client using the Slack OAuth connection
    const slackClient = createSlackClient(configVars["Slack OAuth Connection"]);

    // Loop over the todo items
    for (const item of todoItems) {
      if (item.completed) {
        logger.info(`Skipping completed item ${item.id}`);
      } else {
        // Send a message to the Slack channel for each incomplete item
        logger.info(`Sending message for item ${item.id}`);
        try {
          await slackClient.post("chat.postMessage", {
            channel: configVars["Select Slack Channel"],
            text: `Incomplete task: ${item.task}`,
          });
        } catch (e) {
          throw new Error(`Failed to send message for item ${item.id}: ${e}`);
        }
      }
    }

    // Asynchronously-invoked flows should simply return null
    return { data: null };
  },
});

export default todoAlertsFlow;
