import { action } from "@prismatic-io/spectral";
import { createOauthClient } from "../client";
import {
  connectionInput,
  email,
  cursor,
  limit,
  teamId,
  userId,
  fetchAll,
} from "../inputs";
import {
  getUserResponse,
  listUserConversationsResponse,
  listUsersResponse,
} from "../examplePayloads";
import { debugLogger, paginateResults } from "../utils";

export const getUser = action({
  display: {
    label: "Get User By Email",
    description: "Get a user's information by email",
  },
  perform: async ({ debug: { enabled: debug } }, { connection, email }) => {
    debugLogger({ debug, email });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.users.lookupByEmail({
      email,
    });
    return { data };
  },
  inputs: { email, connection: connectionInput },
  examplePayload: {
    data: getUserResponse,
  },
});

export const getUserById = action({
  display: {
    label: "Get User By ID",
    description: "Get a user's information by ID",
  },
  perform: async ({ debug: { enabled: debug } }, { connection, user }) => {
    debugLogger({ debug, user });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.users.info({
      user,
    });
    return { data };
  },
  inputs: {
    user: userId,
    connection: connectionInput,
  },
  examplePayload: {
    data: getUserResponse,
  },
});

export const listUsers = action({
  display: {
    label: "List Users",
    description: "List Users",
  },
  perform: async (
    { debug: { enabled: debug } },
    { fetchAll, connection, cursor, limit, teamId },
  ) => {
    debugLogger({ cursor, limit, teamId, debug });
    const client = await createOauthClient({
      slackConnection: connection,
    });

    const params = {
      cursor: cursor || undefined,
      limit: limit || undefined,
      team_id: teamId || undefined,
    };

    if (fetchAll) {
      return paginateResults(client, "users", "members", "list", params);
    }

    const data = await client.users.list(params);
    return { data };
  },
  inputs: {
    fetchAll,
    limit,
    cursor,
    teamId,
    connection: connectionInput,
  },
  examplePayload: {
    data: listUsersResponse,
  },
});

export const listUsersConversations = action({
  display: {
    label: "List Users Conversations",
    description: "List Users Conversations",
  },
  perform: async (
    { debug: { enabled: debug } },
    { connection, cursor, limit, teamId, userId, fetchAll },
  ) => {
    debugLogger({ cursor, limit, teamId, userId, debug });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const params = {
      user: userId || undefined,
      cursor: cursor || undefined,
      limit: limit || undefined,
      team_id: teamId || undefined,
    };

    if (fetchAll) {
      return paginateResults(
        client,
        "users",
        "channels",
        "conversations",
        params,
      );
    }

    const data = await client.users.conversations(params);
    return { data };
  },
  inputs: {
    userId,
    fetchAll,
    limit,
    cursor,
    teamId,
    connection: connectionInput,
  },
  examplePayload: {
    data: listUserConversationsResponse,
  },
});
