import {
  connection,
  action,
  component,
  util,
  Connection,
  ConnectionError,
} from "@prismatic-io/spectral";
import { IncomingWebhook } from "@slack/webhook";
import triggers from "./triggers";

const webhookRegex = RegExp(
  "^https://hooks.slack.com/services/T\\w*/B\\w*/\\w*$"
);

export const webhookUrlConnection = connection({
  key: "webhookUrl",
  label: "Webhook URL",
  comments: "Slack Webhook URL hosting",
  inputs: {
    webhookUrl: {
      label: "Webhook URL",
      placeholder: "Slack Webhook URL",
      type: "string",
      required: true,
      comments:
        "The Slack webhook URL. Instructions for generating a Slack webhook are available on the Slack component docs page.",
      example: "https://hooks.slack.com/services/TXXXX/BXXXXX/XXXXXXX",
    },
  },
});

const createClient = (connection: Connection): IncomingWebhook => {
  const { key, fields } = connection;
  if (key !== webhookUrlConnection.key) {
    throw new Error("Unknown connection key provided.");
  }

  // TODO: Make this strongly typed based on the type of connection.
  if (!("webhookUrl" in fields)) {
    throw new ConnectionError(connection, "Invalid connection type provided.");
  }

  const { webhookUrl } = fields;
  if (!webhookRegex.exec(util.types.toString(webhookUrl))) {
    throw new ConnectionError(
      connection,
      `The Slack Webhook URL you provided, "${webhookUrl}", does not follow the format "https://hooks.slack.com/services/TXXXX/BXXXXX/XXXXXXX".`
    );
  }

  const webhook = new IncomingWebhook(util.types.toString(webhookUrl));
  return webhook;
};

export const postSlackMessage = action({
  display: {
    label: "Slack Message",
    description: "Post a message to a Slack channel",
  },
  perform: async (context, { connection, message }) => {
    const webhook = createClient(connection);
    return {
      data: await webhook.send({ text: util.types.toString(message) }),
    };
  },
  inputs: {
    connection: {
      label: "Connection",
      type: "connection",
      required: true,
      comments: "The connection to use",
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
  display: {
    label: "Slack",
    description: "Send messages to Slack channels and users",
    iconPath: "icon.png",
    category: "Application Connectors",
  },
  connections: [webhookUrlConnection],
  actions: { postSlackMessage },
  triggers,
});
