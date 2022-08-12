import { action, util } from "@prismatic-io/spectral";
import { createOauthClient, createWebhookClient } from "../client";
import { handleErrors } from "../errors";
import {
  connectionInput,
  message,
  channelId,
  channelName,
  username,
  messageId,
  userId,
  blocks,
} from "../inputs";

export const postMessage = action({
  display: {
    label: "Post Message",
    description: "Post a message to a slack channel",
  },
  perform: async (
    context,
    { connection, message, channelName, username, messageId }
  ) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.chat.postMessage({
        username: util.types.toString(username) || undefined,
        channel: util.types.toString(channelName),
        text: util.types.toString(message),
        thread_ts: util.types.toString(messageId) || undefined,
      })
    );
    return { data };
  },
  inputs: {
    message,
    channelName,
    username,
    connection: connectionInput,
    messageId: { ...messageId, required: false },
  },
  examplePayload: {
    data: {
      ok: true,
      channel: "C011B7U3R9U",
      ts: "1646951430.367539",
      message: {
        type: "message",
        subtype: "bot_message",
        text: "The message I sent",
        ts: "1646951430.367539",
        username: "My Slack App",
        bot_id: "B036D2DCT54",
      },
      response_metadata: {
        scopes: [
          "identify",
          "chat:write",
          "chat:write.public",
          "chat.write.customize",
        ],
        acceptedScopes: ["chat:write"],
      },
    },
  },
});

export const updateMessage = action({
  display: {
    label: "Update Message",
    description: "Update the contents of an existing message",
  },
  perform: async (context, { connection, message, channelId, messageId }) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.chat.update({
        channel: util.types.toString(channelId),
        ts: util.types.toString(messageId),
        text: util.types.toString(message) || undefined,
      })
    );
    return { data };
  },
  inputs: {
    message,
    messageId,
    channelId,
    connection: connectionInput,
  },
});

export const deletePendingMessage = action({
  display: {
    label: "Delete a pending scheduled message",
    description:
      "Delete the content and metadata of a pending scheduled message from a queue",
  },
  perform: async (context, { connection, messageId, channelId }) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.chat.deleteScheduledMessage({
        channel: util.types.toString(channelId),
        scheduled_message_id: util.types.toString(messageId),
      })
    );
    return { data };
  },
  inputs: {
    messageId,
    channelId,
    connection: connectionInput,
  },
});

export const deleteMessage = action({
  display: {
    label: "Delete message",
    description: "Delete the content and metadata of an existing message",
  },
  perform: async (context, { connection, messageId, channelId }) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.chat.delete({
        channel: util.types.toString(channelId),
        ts: util.types.toString(messageId),
      })
    );
    return { data };
  },
  inputs: {
    messageId,
    channelId,
    connection: connectionInput,
  },
});

export const postEphemeralMessage = action({
  display: {
    label: "Post Ephemeral Message",
    description: "Post an ephemeral message to a user or channel",
  },
  perform: async (
    context,
    { connection, channelName, userId, username, message }
  ) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.chat.postEphemeral({
        channel: util.types.toString(channelName),
        user: util.types.toString(userId),
        username: util.types.toString(username) || undefined,
        text: util.types.toString(message) || undefined,
      })
    );
    return { data };
  },
  inputs: {
    channelName,
    userId,
    username,
    message,
    connection: connectionInput,
  },
});

export const postSlackMessage = action({
  display: {
    label: "Slack Message From Webhook",
    description: "Post a message to a Slack channel from a webhook URL",
  },
  perform: async (context, { connection, message }) => {
    const webhook = createWebhookClient(connection);
    return {
      data: await webhook.send({
        text: util.types.toString(message),
      }),
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

export const postWebhookBlockMessage = action({
  display: {
    label: "Slack Block Message From Webhook",
    description:
      "Post a block formatted message to a Slack channel from a webhook URL",
  },
  perform: async (context, { connection, message, blocks }) => {
    const webhook = createWebhookClient(connection);

    return {
      data: await handleErrors(
        webhook.send({
          text: util.types.toString(message),
          ...blocks,
        })
      ),
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
      ...message,
      label: "Alt Message",
      required: true,
      comments: "This message will override if your block cannot be sent",
    },
    blocks,
  },
  examplePayload: { data: { text: "ok" } },
});

export const postBlockMessage = action({
  display: {
    label: "Post Block Message",
    description: "Post a message to a slack channel",
  },
  perform: async (
    context,
    { connection, blocks, message, channelName, username, messageId }
  ) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.chat.postMessage({
        ...blocks,
        channel: util.types.toString(channelName),
        username: util.types.toString(username) || undefined,
        text: util.types.toString(message),
        thread_ts: util.types.toString(messageId) || undefined,
      })
    );
    return { data };
  },
  inputs: {
    blocks,
    message: {
      ...message,
      label: "Alt Message",
      comments: "This message will override if your block cannot be sent",
    },
    channelName,
    username,
    connection: connectionInput,
    messageId: { ...messageId, required: false },
  },
  examplePayload: {
    data: {
      ok: true,
      channel: "C011B7U3R9U",
      ts: "1646951430.367539",
      message: {
        type: "message",
        subtype: "bot_message",
        text: "The message I sent",
        ts: "1646951430.367539",
        username: "My Slack App",
        bot_id: "B036D2DCT54",
      },
      response_metadata: {
        scopes: [
          "identify",
          "chat:write",
          "chat:write.public",
          "chat:write.customize",
        ],
        acceptedScopes: ["chat:write"],
      },
    },
  },
});

export const listScheduledMessages = action({
  display: {
    label: "List Scheduled Messages",
    description: "List all scheduled messages",
  },
  perform: async (context, { connection }) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await handleErrors(client.chat.scheduledMessages.list());
    return { data };
  },
  inputs: {
    connection: connectionInput,
  },
});
