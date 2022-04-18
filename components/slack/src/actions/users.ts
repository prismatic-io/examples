import { action, input, util } from "@prismatic-io/spectral";
import { createOauthClient } from "../client";
import { connectionInput, email, cursor, limit, teamId } from "../inputs";

export const getUser = action({
  display: {
    label: "Get User By Email",
    description: "Get a user's information by email",
  },
  perform: async (context, { connection, email }) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await client.users.lookupByEmail({
      email: util.types.toString(email),
    });
    return { data };
  },
  inputs: { email, connection: connectionInput },
});

export const getUserById = action({
  display: {
    label: "Get User By ID",
    description: "Get a user's information by ID",
  },
  perform: async (context, { connection, user }) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await client.users.info({ user: util.types.toString(user) });
    return { data };
  },
  inputs: {
    user: input({
      label: "User ID",
      type: "string",
      required: true,
      example: "W012A3CDE",
    }),
    connection: connectionInput,
  },
});

export const listUsers = action({
  display: {
    label: "List Users",
    description: "List Users",
  },
  perform: async (context, { connection, cursor, limit, teamId }) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await client.users.list({
      cursor: util.types.toString(cursor) || undefined,
      limit: util.types.toNumber(limit) || undefined,
      team_id: util.types.toString(teamId) || undefined,
    });
    return { data };
  },
  inputs: {
    limit,
    cursor,
    teamId,
    connection: connectionInput,
  },
});
