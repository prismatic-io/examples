import { action } from "@prismatic-io/spectral";
import { createOauthClient, createWebhookClient } from "../client";
import {
  connectionInput,
  message,
  channelId,
  channelName,
  username,
  messageId,
  userId,
  blocks,
  debug,
  query,
  limit,
  highlight,
  page,
  sortSearch,
  sort_dir,
  team_id,
} from "../inputs";
import {
  deleteMessageResponse,
  deletePendingMessageResponse,
  listScheduledMessagesResponse,
  postBlockMessageResponse,
  postEphemeralMessageResponse,
  postMessageResponse,
  searchMessagesResponse,
  updateMessageResponse,
  webhookDefaultResponse,
} from "../examplePayloads";
import { debugLogger } from "../utils";

export const postMessage = action({
  display: {
    label: "Post Message",
    description: "Post a message to a slack channel",
  },
  perform: async (
    context,
    { connection, message, channelName, username, messageId, debug },
  ) => {
    debugLogger({
      connection,
      message,
      channelName,
      username,
      messageId,
      debug,
    });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.chat.postMessage({
      username: username || undefined,
      channel: channelName,
      text: message,
      thread_ts: messageId || undefined,
    });
    return { data };
  },
  inputs: {
    message,
    channelName,
    username,
    connection: connectionInput,
    messageId: { ...messageId, required: false },
    debug,
  },
  examplePayload: {
    data: postMessageResponse,
  },
});

export const updateMessage = action({
  display: {
    label: "Update Message",
    description: "Update the contents of an existing message",
  },
  perform: async (
    context,
    { connection, message, channelId, messageId, debug },
  ) => {
    debugLogger({ message, channelId, messageId, debug });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.chat.update({
      channel: channelId,
      ts: messageId,
      text: message || undefined,
    });
    return { data };
  },
  inputs: {
    message,
    messageId,
    channelId,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: updateMessageResponse,
  },
});

export const deletePendingMessage = action({
  display: {
    label: "Delete a pending scheduled message",
    description:
      "Delete the content and metadata of a pending scheduled message from a queue",
  },
  perform: async (context, { connection, messageId, channelId, debug }) => {
    debugLogger({ messageId, channelId, debug });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.chat.deleteScheduledMessage({
      channel: channelId,
      scheduled_message_id: messageId,
    });
    return { data };
  },
  inputs: {
    messageId,
    channelId,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: deletePendingMessageResponse,
  },
});

export const deleteMessage = action({
  display: {
    label: "Delete message",
    description: "Delete the content and metadata of an existing message",
  },
  perform: async (context, { connection, messageId, channelId, debug }) => {
    debugLogger({ messageId, channelId, debug });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.chat.delete({
      channel: channelId,
      ts: messageId,
    });
    return { data };
  },
  inputs: {
    messageId,
    channelId,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: deleteMessageResponse,
  },
});

export const postEphemeralMessage = action({
  display: {
    label: "Post Ephemeral Message",
    description: "Post an ephemeral message to a user or channel",
  },
  perform: async (
    context,
    { connection, channelName, userId, username, message, debug },
  ) => {
    debugLogger({ channelName, userId, username, message, debug });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.chat.postEphemeral({
      channel: channelName,
      user: userId,
      username: username || undefined,
      text: message || undefined,
    });
    return { data };
  },
  inputs: {
    channelName,
    userId,
    username,
    message,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: postEphemeralMessageResponse,
  },
});

export const postSlackMessage = action({
  display: {
    label: "Slack Message From Webhook",
    description: "Post a message to a Slack channel from a webhook URL",
  },
  perform: async (context, { connection, message, debug }) => {
    debugLogger({ message, debug });
    const webhook = createWebhookClient(connection);
    return {
      data: await webhook.send({
        text: message,
      }),
    };
  },
  inputs: {
    connection: connectionInput,
    message,
    debug,
  },
  examplePayload: { data: webhookDefaultResponse },
});

export const postWebhookBlockMessage = action({
  display: {
    label: "Slack Block Message From Webhook",
    description:
      "Post a block formatted message to a Slack channel from a webhook URL",
  },
  perform: async (context, { connection, message, blocks, debug }) => {
    debugLogger({ message, blocks, debug });
    const webhook = createWebhookClient(connection);

    return {
      data: await webhook.send({
        text: message,
        ...blocks,
      }),
    };
  },
  inputs: {
    connection: connectionInput,
    message: {
      ...message,
      label: "Alt Message",
      required: true,
      comments: "This message will override if your block cannot be sent",
    },
    blocks,
    debug,
  },
  examplePayload: { data: webhookDefaultResponse },
});

export const postBlockMessage = action({
  display: {
    label: "Post Block Message",
    description: "Post a message to a slack channel",
  },
  perform: async (
    context,
    { connection, blocks, message, channelName, username, messageId, debug },
  ) => {
    debugLogger({ blocks, message, channelName, username, messageId, debug });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.chat.postMessage({
      ...blocks,
      channel: channelName,
      username: username || undefined,
      text: message,
      thread_ts: messageId || undefined,
    });
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
    debug,
  },
  examplePayload: {
    data: postBlockMessageResponse,
  },
});

export const listScheduledMessages = action({
  display: {
    label: "List Scheduled Messages",
    description: "List all scheduled messages",
  },
  perform: async (context, { connection }) => {
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.chat.scheduledMessages.list();
    return { data };
  },
  inputs: {
    connection: connectionInput,
  },
  examplePayload: {
    data: listScheduledMessagesResponse as unknown,
  },
});

export const searchMessages = action({
  display: {
    label: "Search Messages",
    description: "Searches for messages matching a query.",
  },
  perform: async (
    context,
    {
      connection,
      debug,
      count,
      highlight,
      page,
      query,
      sort,
      sort_dir,
      team_id,
    },
  ) => {
    debugLogger({
      debug,
      count,
      highlight,
      page,
      query,
      sort,
      sort_dir,
      team_id,
    });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.search.messages({
      query,
      sort,
      sort_dir,
      count,
      highlight,
      page,
      team_id,
    });
    return { data };
  },
  inputs: {
    query,
    count: {
      ...limit,
      label: "Count",
      comments: "Number of items to return per page.",
    },
    highlight,
    page,
    sort: sortSearch,
    sort_dir,
    team_id,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: searchMessagesResponse,
  },
});
