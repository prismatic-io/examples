import { action, input, util } from "@prismatic-io/spectral";
import { createOauthClient } from "../client";
import {
  connectionInput,
  email,
  cursor,
  limit,
  teamId,
  userId,
} from "../inputs";

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
  examplePayload: {
    data: {
      ok: true,
      user: {
        id: "example",
        color: "example",
        deleted: false,
        real_name: "Example User",
        name: "Example User",
        tz: "America/Chicago",
        profile: {
          title: "example",
          phone: "example",
          skype: "example",
          real_name: "Slackbots",
          real_name_normalized: "example",
          first_name: "example",
          email: "example",
          team: "example",
          display_name: "example",
        },
      },
    },
  },
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
  examplePayload: {
    data: {
      ok: true,
      user: {
        id: "example",
        color: "example",
        deleted: false,
        real_name: "Example User",
        name: "Example User",
        tz: "America/Chicago",
        profile: {
          title: "example",
          phone: "example",
          skype: "example",
          real_name: "Slackbots",
          real_name_normalized: "example",
          always_active: true,
          first_name: "example",
          email: "example",
          team: "example",
          display_name: "example",
        },
      },
    },
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
  examplePayload: {
    data: {
      ok: true,
      members: [
        {
          id: "Exmple",
          team_id: "34700c09vs0zx",
          name: "Example",
          deleted: false,
          color: "37373",
          profile: {
            title: "example",
            phone: "example",
            skype: "example",
            real_name: "Slackbots",
            real_name_normalized: "example",
            always_active: true,
            first_name: "example",
            email: "example",
            team: "example",
            display_name: "example",
          },
        },
      ],
      response_metadata: {
        next_cursor: "",
        scopes: ["admin", "idetify", "channels:read"],
      },
    },
  },
});

export const listUsersConversations = action({
  display: {
    label: "List Users Conversations",
    description: "List Users Conversations",
  },
  perform: async (context, { connection, cursor, limit, teamId, userId }) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await client.users.conversations({
      user: util.types.toString(userId) || undefined,
      cursor: util.types.toString(cursor) || undefined,
      limit: util.types.toNumber(limit) || undefined,
      team_id: util.types.toString(teamId) || undefined,
    });
    return { data };
  },
  inputs: {
    userId,
    limit,
    cursor,
    teamId,
    connection: connectionInput,
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
