import { action, input, util } from "@prismatic-io/spectral";
import { createOauthClient } from "../client";
import {
  connectionInput,
  channelName,
  teamId,
  isPrivate,
  conversationName,
  cursor,
  limit,
  excludeArchived,
  userId,
  includePublicChannels,
  includePrivateChannels,
  includeMultiPartyImchannels,
  includeImChannels,
} from "../inputs";
import { handleErrors } from "../errors";
import { generateChannelTypesString } from "../utils";

export const createConversation = action({
  display: {
    label: "Create Conversation",
    description: "Create a new conversation",
  },
  perform: async (context, { connection, isPrivate, conversationName }) => {
    const client = await createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.conversations.create({
        name: util.types.toString(conversationName),
        is_private: util.types.toBool(isPrivate) || undefined,
        team_id: util.types.toString(teamId) || undefined,
      })
    );
    return { data };
  },
  inputs: { conversationName, isPrivate, teamId, connection: connectionInput },
  examplePayload: {
    data: {
      ok: true,
      channels: [
        {
          id: "COZ7e3d",
          name: "example channel",
          is_channel: true,
          is_group: false,
          is_im: false,
          is_private: false,
          is_archived: false,
          created: 6426934241,
          creator: "example",
          unlinked: 0,
          name_normalized: "example channel",
          shared_team_ids: ["TW2oP78"],
          purpose: {
            value: "This channel was created for an example response.",
          },
        },
      ],
    },
  },
});

export const closeConversation = action({
  display: {
    label: "Close Conversation",
    description: "Close an existing conversation",
  },
  perform: async (context, { connection, conversationName }) => {
    const client = await createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.conversations.close({
        channel: util.types.toString(conversationName),
      })
    );
    return { data };
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
    const client = await createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.conversations.rename({
        channel: util.types.toString(conversationName),
        name: util.types.toString(newConversationName),
      })
    );
    return { data };
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

export const getConversationsHistory = action({
  display: {
    label: "Get Conversation History",
    description: "Get the history of a conversation",
  },
  perform: async (
    context,
    {
      connection,
      cursor,
      includeAllMetadata,
      limit,
      channelName,
      oldest,
      inclusive,
      latest,
    }
  ) => {
    const client = await createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.conversations.history({
        channel: util.types.toString(channelName),
        cursor: util.types.toString(cursor) || undefined,
        include: util.types.toBool(includeAllMetadata) || undefined,
        limit: util.types.toNumber(limit) || undefined,
        inclusive: inclusive,
        ...(oldest ? { oldest: util.types.toString(oldest) } : {}),
        ...(latest ? { latest: util.types.toString(latest) } : {}),
      })
    );
    return { data };
  },
  inputs: {
    channelName,
    limit,
    cursor,
    includeAllMetadata: input({
      label: "Include All Metadata",
      type: "boolean",
      default: false,
    }),
    inclusive: input({
      label: "Inclusive",
      comments:
        "Include messages with oldest or latest timestamps in results. Ignored unless either timestamp is specified",
      type: "boolean",
      required: false,
      default: false,
    }),
    latest: input({
      label: "Latest",
      comments:
        "Only messages before this Unix timestamp will be included in results. Default is current time.",
      type: "string",
      required: false,
    }),
    oldest: input({
      label: "Oldest",
      comments:
        "Only messages after this Unix timestamp will be included in results",
      type: "string",
      required: false,
    }),
    connection: connectionInput,
  },
  examplePayload: {
    data: {
      ok: true,
      messages: [
        {
          client_msg_id: "123123-123123-123123",
          type: "message",
          text: "hello world",
          user: "U01QFFSE2QK",
          ts: "166149417.178179",
          team: "TH0GJM0M8",
        },
      ],
    },
  },
});

export const listConversations = action({
  display: {
    label: "List Conversations",
    description: "List all conversations",
  },
  perform: async (context, params) => {
    const client = await createOauthClient({
      slackConnection: params.connection,
    });

    const data = await handleErrors(
      client.conversations.list({
        cursor: util.types.toString(params.cursor) || undefined,
        exclude_archived:
          util.types.toBool(params.excludeArchived) || undefined,
        limit: util.types.toNumber(params.limit) || undefined,
        team_id: util.types.toString(params.teamId) || undefined,
        types: generateChannelTypesString(params),
      })
    );
    return { data };
  },
  inputs: {
    teamId,
    limit,
    cursor,
    excludeArchived,
    connection: connectionInput,
    includePublicChannels,
    includePrivateChannels,
    includeMultiPartyImchannels,
    includeImChannels,
  },
  examplePayload: {
    data: {
      ok: true,
      channels: [
        {
          id: "COZ7e3d",
          name: "example channel",
          is_channel: true,
          is_group: false,
          is_im: false,
          is_private: false,
          is_archived: false,
          created: 6426934241,
          creator: "example",
          unlinked: 0,
          name_normalized: "example channel",
          shared_team_ids: ["TW2oP78"],
          purpose: {
            value: "This channel was created for an example response.",
          },
        },
      ],
    },
  },
});

export const leaveConversation = action({
  display: {
    label: "Leave Conversations",
    description: "Leave an existing conversation",
  },
  perform: async (context, { connection, channelName }) => {
    const client = await createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.conversations.leave({
        channel: util.types.toString(channelName),
      })
    );
    return { data };
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
  perform: async (context, { connection, channelName, cursor, limit }) => {
    const client = await createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.conversations.members({
        cursor: util.types.toString(cursor) || undefined,
        limit: util.types.toNumber(limit) || undefined,
        channel: util.types.toString(channelName),
      })
    );
    return { data };
  },
  inputs: {
    channelName,
    limit,
    cursor,
    connection: connectionInput,
  },
});

export const archiveConversation = action({
  display: {
    label: "Archive Conversation",
    description: "Archive an existing conversation",
  },
  perform: async (context, { connection, channelName }) => {
    const client = await createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.conversations.archive({
        channel: util.types.toString(channelName),
      })
    );
    return { data };
  },
  inputs: {
    channelName,
    connection: connectionInput,
  },
});

export const conversationExists = action({
  display: {
    label: "Conversation Exists",
    description: "Returns true if the conversation already exists",
  },
  perform: async (context, { connection, channelName }) => {
    const client = await createOauthClient({ slackConnection: connection });
    const data = await client.conversations.list();

    const channels = data.channels.filter((channel) => {
      return channel.name === channelName || channel.id === channelName;
    });

    if (channels.length > 0) {
      return { data: true };
    }

    return { data: false };
  },
  inputs: {
    channelName,
    connection: connectionInput,
  },
});

export const inviteUserToConversation = action({
  display: {
    label: "Invite User To Conversation",
    description: "Invite a user to an existing conversation",
  },
  perform: async (context, { connection, channelName, userId }) => {
    const client = await createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.conversations.invite({
        channel: util.types.toString(channelName),
        users: util.types.toString(userId),
      })
    );

    return { data };
  },
  inputs: {
    channelName,
    userId,
    connection: connectionInput,
  },
});

export const setConversationPurpose = action({
  display: {
    label: "Set Conversation Purpose",
    description: "Set the purpose of an existing conversation",
  },
  perform: async (context, { connection, channelName, purpose }) => {
    const client = await createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.conversations.setPurpose({
        channel: util.types.toString(channelName),
        purpose: util.types.toString(purpose),
      })
    );

    return { data };
  },
  inputs: {
    channelName,
    userId,
    connection: connectionInput,
    purpose: {
      label: "Conversation Purpose",
      type: "string",
      comments:
        "Provide a string value for the purpose of the given conversation.",
      example: "Engineering",
    },
  },
});

export const setConversationTopic = action({
  display: {
    label: "Set Conversation Topic",
    description: "Set the purpose of an existing conversation",
  },
  perform: async (context, { connection, channelName, topic }) => {
    const client = await createOauthClient({ slackConnection: connection });
    const data = await handleErrors(
      client.conversations.setTopic({
        channel: util.types.toString(channelName),
        topic: util.types.toString(topic),
      })
    );

    return { data };
  },
  inputs: {
    connection: connectionInput,
    channelName,
    userId,
    topic: {
      label: "Conversation Topic",
      type: "string",
      comments:
        "Provide a string value for the topic of the given conversation.",
      example: "Engineering",
    },
  },
});
