import { action, util } from "@prismatic-io/spectral";
import { createClient } from "../client";
import {
  connectionInput,
  channelName,
  teamId,
  isPrivate,
  conversationName,
  cursor,
  limit,
  excludeArchived,
} from "../inputs";

export const createConversation = action({
  display: {
    label: "Create Conversation",
    description: "Create a new conversation",
  },
  perform: async (context, { connection, isPrivate, conversationName }) => {
    const { client, app } = await createClient({ slackConnection: connection });

    try {
      const data = await client.conversations.create({
        name: util.types.toString(conversationName),
        is_private: util.types.toBool(isPrivate) || undefined,
        team_id: util.types.toString(teamId) || undefined,
        token: util.types.toString(connection.token.access_token),
      });
      return { data };
    } finally {
      await app.stop();
    }
  },
  inputs: { conversationName, isPrivate, teamId, connection: connectionInput },
});

export const closeConversation = action({
  display: {
    label: "Close Conversation",
    description: "Close an existing conversation",
  },
  perform: async (context, { connection, conversationName }) => {
    const { client, app } = await createClient({ slackConnection: connection });

    try {
      const data = await client.conversations.close({
        channel: util.types.toString(conversationName),
        token: util.types.toString(connection.token.access_token),
      });
      return { data };
    } finally {
      await app.stop();
    }
  },
  inputs: { conversationName, connection: connectionInput },
});

export const renameConversation = action({
  display: {
    label: "Rename Conversation",
    description: "Rename an existing conversation",
  },
  perform: async (
    context,
    { connection, newConversationName, conversationName }
  ) => {
    const { client, app } = await createClient({ slackConnection: connection });

    try {
      const data = await client.conversations.rename({
        channel: util.types.toString(conversationName),
        name: util.types.toString(newConversationName),
        token: util.types.toString(connection.token.access_token),
      });
      return { data };
    } finally {
      await app.stop();
    }
  },
  inputs: {
    conversationName,
    newConversationName: {
      ...conversationName,
      label: "New Conversation Name",
    },
    connection: connectionInput,
  },
});

export const listConversations = action({
  display: {
    label: "List Conversations",
    description: "List all conversations",
  },
  perform: async (
    context,
    { connection, cursor, excludeArchived, limit, teamId }
  ) => {
    const { client, app } = await createClient({ slackConnection: connection });

    try {
      const data = await client.conversations.list({
        cursor: util.types.toString(cursor) || undefined,
        exclude_archived: util.types.toBool(excludeArchived) || undefined,
        limit: util.types.toNumber(limit) || undefined,
        team_id: util.types.toString(teamId) || undefined,
        token: util.types.toString(connection.token.access_token),
      });
      return { data };
    } finally {
      await app.stop();
    }
  },
  inputs: {
    teamId,
    limit,
    cursor,
    excludeArchived,
    connection: connectionInput,
  },
});

export const leaveConversation = action({
  display: {
    label: "Leave Conversations",
    description: "Leave an existing conversation",
  },
  perform: async (context, { connection, channelName }) => {
    const { client, app } = await createClient({ slackConnection: connection });

    try {
      const data = await client.conversations.leave({
        channel: util.types.toString(channelName),
        token: util.types.toString(connection.token.access_token),
      });
      return { data };
    } finally {
      await app.stop();
    }
  },
  inputs: {
    channelName,
    connection: connectionInput,
  },
});

export const listConversationMembers = action({
  display: {
    label: "List Conversation Members",
    description: "List all members of a conversation",
  },
  perform: async (context, { connection, channelName }) => {
    const { client, app } = await createClient({ slackConnection: connection });

    try {
      const data = await client.conversations.members({
        cursor: util.types.toString(cursor) || undefined,
        limit: util.types.toNumber(limit) || undefined,
        channel: util.types.toString(channelName),
        token: util.types.toString(connection.token.access_token),
      });
      return { data };
    } finally {
      await app.stop();
    }
  },
  inputs: {
    channelName,
    limit,
    cursor,
    excludeArchived,
    connection: connectionInput,
  },
});
