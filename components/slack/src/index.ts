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
        "Slack Webhook URL in the form `https://hooks.slack.com/services/FOO/BAR/BAZ`",
    },
    {
      key: "message",
      label: "Message",
      placeholder: "Message to send",
      type: "string",
      required: true,
      comments: "Message to send the slack channel.",
    },
  ],
});

export default component({
  key: "slack",
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
