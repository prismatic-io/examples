import { action } from "@prismatic-io/spectral";
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
  includeAllMetadata,
  inclusive,
  latest,
  oldest,
  conversationPurpose,
  conversationTopic,
  debug,
  connected_team_ids,
  search_channel_types,
  sort,
  sort_dir,
  team_ids,
  total_count_only,
  fetchAll,
} from "../inputs";
import {
  debugLogger,
  generateChannelTypesString,
  paginateResults,
} from "../utils";
import {
  archiveConversationResponse,
  closeConversationResponse,
  createConversationResponse,
  getConversationsHistoryResponse,
  inviteUserToConversationResponse,
  leaveConversationResponse,
  listConversationMembersResponse,
  listConversationResponse,
  renameConversationResponse,
  inviteUserToConversationResponse as setConversationTopicResponse,
  archiveConversationResponse as setConversationPurposeResponse,
} from "../examplePayloads";

export const createConversation = action({
  display: {
    label: "Create Conversation",
    description: "Create a new conversation",
  },
  perform: async (
    context,
    { connection, isPrivate, conversationName, teamId, debug },
  ) => {
    debugLogger({ debug, isPrivate, conversationName, teamId });
    const client = await createOauthClient({ slackConnection: connection });
    const data = await client.conversations.create({
      name: conversationName,
      is_private: isPrivate || undefined,
      team_id: teamId || undefined,
    });
    return { data };
  },
  inputs: {
    conversationName,
    isPrivate,
    teamId,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: createConversationResponse,
  },
});

export const closeConversation = action({
  display: {
    label: "Close Conversation",
    description: "Close an existing conversation",
  },
  perform: async (context, { connection, conversationName, debug }) => {
    debugLogger({ debug, conversationName });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.conversations.close({
      channel: conversationName,
    });
    return { data };
  },
  inputs: { conversationName, connection: connectionInput, debug },
  examplePayload: {
    data: closeConversationResponse,
  },
});

export const renameConversation = action({
  display: {
    label: "Rename Conversation",
    description: "Rename an existing conversation",
  },
  perform: async (
    context,
    { connection, newConversationName, conversationName, debug },
  ) => {
    debugLogger({ debug, newConversationName, conversationName });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.conversations.rename({
      channel: conversationName,
      name: newConversationName,
    });
    return { data };
  },
  inputs: {
    conversationName,
    newConversationName: {
      ...conversationName,
      label: "New Conversation Name",
    },
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: renameConversationResponse,
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
      debug,
      fetchAll,
    },
  ) => {
    debugLogger({
      debug,
      channelName,
      cursor,
      includeAllMetadata,
      limit,
      oldest,
      inclusive,
      latest,
    });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const params = {
      channel: channelName,
      cursor: cursor || undefined,
      include_all_metadata: includeAllMetadata || undefined,
      limit: limit || undefined,
      inclusive,
      ...(oldest ? { oldest } : {}),
      ...(latest ? { latest } : {}),
    };

    if (fetchAll) {
      return paginateResults(
        client,
        "conversations",
        "messages",
        "history",
        params,
      );
    }

    const data = await client.conversations.history(params);
    return { data };
  },
  inputs: {
    channelName,
    fetchAll,
    limit,
    cursor,
    includeAllMetadata,
    inclusive,
    latest,
    oldest,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: getConversationsHistoryResponse,
  },
});

export const listConversations = action({
  display: {
    label: "List Conversations",
    description: "List all conversations",
  },
  perform: async (context, params) => {
    debugLogger(params);
    const client = await createOauthClient({
      slackConnection: params.connection,
    });

    const parameters = {
      cursor: params.cursor || undefined,
      exclude_archived: params.excludeArchived || undefined,
      limit: params.limit || undefined,
      team_id: params.teamId || undefined,
      types: generateChannelTypesString(params),
    };

    if (params.fetchAll) {
      return paginateResults(
        client,
        "conversations",
        "channels",
        "list",
        parameters,
      );
    }

    const data = await client.conversations.list(parameters);
    return { data };
  },
  inputs: {
    teamId,
    limit,
    cursor,
    fetchAll,
    excludeArchived,
    connection: connectionInput,
    includePublicChannels,
    includePrivateChannels,
    includeMultiPartyImchannels,
    includeImChannels,
    debug,
  },
  examplePayload: {
    data: listConversationResponse,
  },
});

export const leaveConversation = action({
  display: {
    label: "Leave Conversations",
    description: "Leave an existing conversation",
  },
  perform: async (context, { connection, channelName, debug }) => {
    debugLogger({ debug, channelName });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.conversations.leave({
      channel: channelName,
    });
    return { data };
  },
  inputs: {
    channelName,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: leaveConversationResponse,
  },
});

export const listConversationMembers = action({
  display: {
    label: "List Conversation Members",
    description: "List all members of a conversation",
  },
  perform: async (
    context,
    { fetchAll, connection, channelName, cursor, limit, debug },
  ) => {
    debugLogger({ debug, channelName, cursor, limit });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const params = {
      cursor: cursor || undefined,
      limit: limit || undefined,
      channel: channelName,
    };

    if (fetchAll) {
      return paginateResults(
        client,
        "conversations",
        "members",
        "members",
        params,
      );
    }

    const data = await client.conversations.members(params);
    return { data };
  },
  inputs: {
    channelName,
    fetchAll,
    limit,
    cursor,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: listConversationMembersResponse,
  },
});

export const archiveConversation = action({
  display: {
    label: "Archive Conversation",
    description: "Archive an existing conversation",
  },
  perform: async (context, { connection, channelName, debug }) => {
    debugLogger({ debug, channelName });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.conversations.archive({
      channel: channelName,
    });
    return { data };
  },
  inputs: {
    channelName,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: archiveConversationResponse,
  },
});

export const conversationExists = action({
  display: {
    label: "Conversation Exists",
    description: "Returns true if the conversation already exists",
  },
  perform: async (context, { connection, channelName, debug }) => {
    debugLogger({ debug, channelName });
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
    debug,
  },
  examplePayload: {
    data: true,
  },
});

export const inviteUserToConversation = action({
  display: {
    label: "Invite User To Conversation",
    description: "Invite a user to an existing conversation",
  },
  perform: async (context, { connection, channelName, userId, debug }) => {
    debugLogger({ debug, channelName, userId });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.conversations.invite({
      channel: channelName,
      users: userId,
    });

    return { data };
  },
  inputs: {
    channelName,
    userId,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: inviteUserToConversationResponse,
  },
});

export const setConversationPurpose = action({
  display: {
    label: "Set Conversation Purpose",
    description: "Set the purpose of an existing conversation",
  },
  perform: async (context, { connection, channelName, purpose, debug }) => {
    debugLogger({ debug, channelName, purpose });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.conversations.setPurpose({
      channel: channelName,
      purpose,
    });

    return { data };
  },
  inputs: {
    channelName,
    connection: connectionInput,
    purpose: conversationPurpose,
    debug,
  },
  examplePayload: {
    data: setConversationPurposeResponse,
  },
});

export const setConversationTopic = action({
  display: {
    label: "Set Conversation Topic",
    description: "Set the purpose of an existing conversation",
  },
  perform: async (context, { connection, channelName, topic, debug }) => {
    debugLogger({ debug, channelName, topic });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.conversations.setTopic({
      channel: channelName,
      topic,
    });

    return { data };
  },
  inputs: {
    connection: connectionInput,
    channelName,
    userId,
    topic: conversationTopic,
    debug,
  },
  examplePayload: {
    data: setConversationTopicResponse,
  },
});

export const searchConversation = action({
  display: {
    label: "Search Conversation",
    description:
      "Search for public or private channels in an Enterprise organization.",
  },
  perform: async (
    context,
    {
      connection,
      debug,
      connected_team_ids,
      cursor,
      limit,
      query,
      search_channel_types,
      sort,
      sort_dir,
      team_ids,
      total_count_only,
    },
  ) => {
    debugLogger({
      debug,
      connected_team_ids,
      cursor,
      limit,
      query,
      search_channel_types,
      sort,
      sort_dir,
      team_ids,
      total_count_only,
    });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.admin.conversations.search({
      connected_team_ids,
      cursor,
      limit,
      query,
      search_channel_types,
      sort,
      sort_dir,
      team_ids: team_ids as [string, ...string[]],
      total_count_only,
    });
    return { data };
  },
  inputs: {
    connected_team_ids,
    cursor,
    limit,
    query: channelName,
    search_channel_types,
    sort,
    sort_dir,
    team_ids,
    total_count_only,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: closeConversationResponse,
  },
});
