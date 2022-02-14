import { Connection, ConnectionError, util } from "@prismatic-io/spectral";
import { App } from "@slack/bolt";
import { IncomingWebhook } from "@slack/webhook";

interface CreateClientProps {
  slackConnection?: Connection;
}

export const getApp = ({ slackConnection }: CreateClientProps) => {
  if (slackConnection.key !== "oauth2") {
    throw new ConnectionError(
      slackConnection,
      `Unsupported authorization method ${slackConnection.key}.`
    );
  }

  return new App({
    token: util.types.toString(slackConnection.token.access_token),
    signingSecret: util.types.toString(slackConnection.fields.signingSecret),
    scopes: util.types.toString(slackConnection.fields.scopes),
    clientId: util.types.toString(slackConnection.fields.clientId),
    clientSecret: util.types.toString(slackConnection.fields.clientSecret),
  });
};

export const createClient = async ({ slackConnection }: CreateClientProps) => {
  const app = getApp({ slackConnection });
  await app.start(process.env.port || 3000);

  return { client: app.client, app };
};

export const createWebhookClient = (
  connection: Connection
): IncomingWebhook => {
  const webhookRegex = RegExp(
    "^https://hooks.slack.com/services/T\\w*/B\\w*/\\w*$"
  );
  const { key, fields } = connection;
  if (key !== "webhookUrl") {
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
