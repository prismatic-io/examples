import { action, component, util } from "@prismatic-io/spectral";
import { version } from "../package.json";
import { IncomingWebhook } from "@slack/webhook";

const webhookRegex = RegExp(
  "^https://hooks.slack.com/services/T\\w*/B\\w*/\\w*$"
);

export const postSlackMessage = action({
  display: {
    label: "Slack Message",
    description: "Post a message to a Slack channel",
  },
  perform: async (context, { message, webhookUrl }) => {
    if (!webhookRegex.exec(util.types.toString(webhookUrl))) {
      throw new Error(
        `The Slack Webhook URL you provided, "${webhookUrl}", did not follow the format "https://hooks.slack.com/services/TXXXX/BXXXXX/XXXXXXX".`
      );
    }

    const webhook = new IncomingWebhook(util.types.toString(webhookUrl));
    return {
      data: await webhook.send({ text: util.types.toString(message) }),
    };
  },
  inputs: {
    webhookUrl: {
      label: "Webhook URL",
      placeholder: "Slack Webhook URL",
      type: "string",
      required: true,
      comments:
        "The Slack webhook URL. Instructions for generating a Slack webhook are available on the Slack component docs page.",
      example: "https://hooks.slack.com/services/A/B/C",
    },
    message: {
      label: "Message",
      placeholder: "Message to send",
      type: "string",
      required: true,
      comments: "The message to send the Slack channel.",
      example: "Hello from Prismatic!",
    },
  },
  examplePayload: { data: { text: "ok" } },
});

export default component({
  key: "slack",
  documentationUrl: "https://prismatic.io/docs/components/slack",
  public: true,
  version,
  display: {
    label: "Slack",
    description: "Post messages to Slack",
    iconPath: "icon.png",
  },
  actions: { postSlackMessage },
});
