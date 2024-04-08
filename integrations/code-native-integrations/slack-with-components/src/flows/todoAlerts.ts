/**
 * This flow has similar functionality to the low-code "Build Your First Integration" tutorial
 * from the Prismatic documentation. It fetches TODO items from an Acme API and sends incomplete
 * items to a Slack channel of the user's choosing.
 *
 * https://prismatic.io/docs/getting-started/first-integration/build-first-integration/
 */

import { Connection, flow } from "@prismatic-io/spectral";
import { ConfigPages } from "../configPages";
import axios from "axios";
import { createSlackClient } from "../slackClient";

interface TodoItem {
  id: number;
  completed: boolean;
  task: string;
}

export const todoAlertsFlow = flow<ConfigPages>({
  name: "Send TODO messages to Slack",
  stableKey: "todo-alerts-flow",
  description: "Fetch TODO items from Acme and send to Slack",
  // This function runs when the trigger has completed its work
  onExecution: async (context) => {
    // Config variables are accessed using the context object
    const { logger, configVars } = context;

    const { data: todoItems } = await axios.get<TodoItem[]>(
      configVars["Acme API Endpoint"]
    );

    const slackClient = createSlackClient(
      configVars["Slack OAuth Connection"] as Connection
    );

    for (const item of todoItems) {
      if (item.completed) {
        logger.info(`Skipping completed item ${item.id}`);
      } else {
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

    return { data: null };
  },
});

export default todoAlertsFlow;
