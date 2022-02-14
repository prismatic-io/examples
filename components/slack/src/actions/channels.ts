import { action, util } from "@prismatic-io/spectral";
import { createClient } from "../client";
import {
  connectionInput,
  channelName,
  teamId,
  validate,
  excludeArchived,
  cursor,
  limit,
  excludeMembers,
} from "../inputs";

export const createChannel = action({
  display: {
    label: "Create Channel",
    description: "Create a new channel",
  },
  perform: async (context, { connection, validate }) => {
    const { client, app } = await createClient({ slackConnection: connection });

    try {
      const data = await client.channels.create({
        name: util.types.toString(channelName),
        team_id: util.types.toString(teamId) || undefined,
        token: util.types.toString(connection.token.access_token),
        validate: util.types.toBool(validate) || undefined,
      });
      return { data };
    } finally {
      await app.stop();
    }
  },
  inputs: { channelName, validate, teamId, connection: connectionInput },
});

export const listChannels = action({
  display: {
    label: "List Channels",
    description: "List all channels",
  },
  perform: async (
    context,
    { connection, cursor, limit, teamId, excludeArchived, excludeMembers }
  ) => {
    const { client, app } = await createClient({ slackConnection: connection });

    try {
      const data = await client.channels.list({
        cursor: util.types.toString(cursor) || undefined,
        exclude_archived: util.types.toBool(excludeArchived),
        exclude_members: util.types.toBool(excludeMembers),
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
    cursor,
    limit,
    teamId,
    excludeArchived,
    excludeMembers,
    connection: connectionInput,
  },
});

export const renameChannel = action({
  display: {
    label: "Rename Channel",
    description: "Change the name of an existing channel",
  },
  perform: async (context, { connection, channelName, newName, validate }) => {
    const { client, app } = await createClient({ slackConnection: connection });

    try {
      const data = await client.channels.rename({
        channel: util.types.toString(channelName),
        name: util.types.toString(newName),
        validate: util.types.toBool(validate) || undefined,
        token: util.types.toString(connection.token.access_token),
      });
      return { data };
    } finally {
      await app.stop();
    }
  },
  inputs: {
    channelName,
    newName: { ...channelName, label: "New Channel Name" },
    validate,
    connection: connectionInput,
  },
});

export const archiveChannel = action({
  display: {
    label: "Archive Channel",
    description: "Archive an existing channel",
  },
  perform: async (context, { connection, channelName }) => {
    const { client, app } = await createClient({ slackConnection: connection });

    try {
      const data = await client.channels.archive({
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
