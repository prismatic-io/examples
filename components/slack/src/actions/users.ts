import { action, util } from "@prismatic-io/spectral";
import { createClient } from "../client";
import { connectionInput, email, cursor, limit, teamId } from "../inputs";

export const getUser = action({
  display: {
    label: "Get User",
    description: "Get a user's information by email.",
  },
  perform: async (context, { connection, email }) => {
    const { client, app } = await createClient({ slackConnection: connection });

    try {
      const data = await client.users.lookupByEmail({
        email: util.types.toString(email),
        token: util.types.toString(connection.token.access_token),
      });
      return { data };
    } finally {
      await app.stop();
    }
  },
  inputs: { email, connection: connectionInput },
});

export const listUsers = action({
  display: {
    label: "List Users",
    description: "List Users",
  },
  perform: async (context, { connection, cursor, limit, teamId }) => {
    const { client, app } = await createClient({ slackConnection: connection });

    try {
      const data = await client.users.list({
        cursor: util.types.toString(cursor) || undefined,
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
    limit,
    cursor,
    teamId,
    connection: connectionInput,
  },
});
