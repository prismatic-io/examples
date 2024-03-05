/**
 * This flow has similar functionality to the low-code "Build Your First Integration" tutorial
 * from the Prismatic documentation. It fetches TODO items from an Acme API and sends incomplete
 * items to a Slack channel of the user's choosing.
 *
 * https://prismatic.io/docs/getting-started/first-integration/build-first-integration/
 */

import { flow } from "@prismatic-io/spectral";
import { configPages } from "../configPages";
import axios from "axios";
import { createSlackClient } from "../slackClient";

interface TodoItem {
  id: number;
  completed: boolean;
  task: string;
}

// <typeof configPages> provides your flow with type hinting and access to config variables defined in configPages
export const todoAlertsFlow = flow<typeof configPages>({
  name: "Send TODO messages to Slack",
  stableKey: "542df00f-e885-4298-b91c-8a9d1f0de7f7",
  description: "Fetch TODO items from Acme and send to Slack",
  // This trigger function is simple - it just returns the payload it receives
  onTrigger: async (context, payload) => {
    return Promise.resolve({ payload });
  },
  // This function runs when the trigger has completed its work
  onExecution: async (context) => {
    // Config variables are accessed using the context object
    const { logger, configVars } = context;

    const { data: todoItems } = await axios.get<TodoItem[]>(
      configVars["Acme API Endpoint"]
    );

    const slackClient = createSlackClient(configVars["Slack OAuth Connection"]);

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
