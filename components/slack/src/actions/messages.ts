import { action, util } from "@prismatic-io/spectral";
import { createOauthClient, createWebhookClient } from "../client";
import { handleErrors } from "../errors";
import {
  connectionInput,
  message,
  channelId,
  channelName,
  username,
  asUser,
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
    { connection, message, channelName, username, asUser, messageId }
  ) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.chat.postMessage({
        channel: util.types.toString(channelName),
        username: util.types.toString(username) || undefined,
        text: util.types.toString(message),
        as_user: util.types.toBool(asUser),
        thread_ts: util.types.toString(messageId) || undefined,
      })
    );
    return { data };
  },
  inputs: {
    message,
    channelName,
    username,
    asUser,
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
        scopes: ["identify", "chat:write:bot"],
        acceptedScopes: ["chat:write:bot"],
      },
    },
  },
});

export const updateMessage = action({
  display: {
    label: "Update Message",
    description: "Update the contents of an existing message",
  },
  perform: async (
    context,
    { connection, message, channelId, asUser, messageId }
  ) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.chat.update({
        channel: util.types.toString(channelId),
        ts: util.types.toString(messageId),
        text: util.types.toString(message) || undefined,
        as_user: util.types.toBool(asUser),
      })
    );
    return { data };
  },
  inputs: {
    message,
    messageId,
    channelId,
    asUser,
    connection: connectionInput,
  },
});

export const deletePendingMessage = action({
  display: {
    label: "Delete a pending scheduled message",
    description:
      "Delete the content and metadata of a pending scheduled message from a queue",
  },
  perform: async (context, { connection, messageId, asUser, channelId }) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.chat.deleteScheduledMessage({
        channel: util.types.toString(channelId),
        scheduled_message_id: util.types.toString(messageId),
        as_user: util.types.toBool(asUser),
      })
    );
    return { data };
  },
  inputs: {
    messageId,
    channelId,
    asUser,
    connection: connectionInput,
  },
});

export const deleteMessage = action({
  display: {
    label: "Delete message",
    description: "Delete the content and metadata of an existing message",
  },
  perform: async (context, { connection, messageId, asUser, channelId }) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.chat.delete({
        channel: util.types.toString(channelId),
        ts: util.types.toString(messageId),
        as_user: util.types.toBool(asUser),
      })
    );
    return { data };
  },
  inputs: {
    messageId,
    channelId,
    asUser,
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
    { connection, channelName, userId, username, asUser, message }
  ) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.chat.postEphemeral({
        channel: util.types.toString(channelName),
        user: util.types.toString(userId),
        username: util.types.toString(username) || undefined,
        text: util.types.toString(message) || undefined,
        as_user: util.types.toBool(asUser),
      })
    );
    return { data };
  },
  inputs: {
    channelName,
    userId,
    username,
    asUser,
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
          blocks: util.types.isJSON(util.types.toString(blocks))
            ? JSON.parse(util.types.toString(blocks)) || []
            : blocks || [],
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
      required: false,
      comments: "This message will override if your block cannot be sent",
    },
    blocks: { ...blocks },
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
    { connection, blocks, message, channelName, username, asUser, messageId }
  ) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.chat.postMessage({
        channel: util.types.toString(channelName),
        username: util.types.toString(username) || undefined,
        blocks: util.types.isJSON(util.types.toString(blocks))
          ? JSON.parse(util.types.toString(blocks)) || []
          : blocks || [],
        text: util.types.toString(message),
        as_user: util.types.toBool(asUser),
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
      required: false,
      comments: "This message will override if your block cannot be sent",
    },
    channelName,
    username,
    asUser,
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
        scopes: ["identify", "chat:write:bot"],
        acceptedScopes: ["chat:write:bot"],
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
