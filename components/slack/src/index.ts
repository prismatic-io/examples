import { action, component } from "@prismatic-io/spectral";
import { version } from "../package.json";
import { IncomingWebhook } from "@slack/webhook";

const postSlackMessageAction = action({
  key: "postSlackMessage",
  display: {
    label: "Slack Message",
    description: "Post a message to a Slack channel",
  },
  perform: async (context, { message, webhookUrl }) => {
    const webhook = new IncomingWebhook(webhookUrl);
    return {
      data: await webhook.send({ text: message.toString() }),
    };
  },
  inputs: [
    {
      key: "webhookUrl",
      label: "Webhook URL",
      placeholder: "Slack Webhook URL",
      type: "string",
      required: true,
      comments:
        "The Slack webhook URL. Instructions for generating a Slack webhook are available on the Slack component docs page.",
      example: "https://hooks.slack.com/services/A/B/C",
    },
    {
      key: "message",
      label: "Message",
      placeholder: "Message to send",
      type: "string",
      required: true,
      comments: "The message to send the Slack channel.",
      example: "Hello from Prismatic!",
    },
  ],
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
  actions: {
    ...postSlackMessageAction,
  },
});
