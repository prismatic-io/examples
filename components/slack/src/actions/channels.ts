import { action, util } from "@prismatic-io/spectral";
import { createOauthClient } from "../client";
import { connectionInput, channelName, teamId, validate } from "../inputs";

export const createChannel = action({
  display: {
    label: "Create Channel",
    description: "Create a new channel",
  },
  perform: async (context, { connection, validate }) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await client.channels.create({
      name: util.types.toString(channelName),
      team_id: util.types.toString(teamId) || undefined,
      validate: util.types.toBool(validate) || undefined,
    });
    return { data };
  },
  inputs: { channelName, validate, teamId, connection: connectionInput },
});

export const renameChannel = action({
  display: {
    label: "Rename Channel",
    description: "Change the name of an existing channel",
  },
  perform: async (context, { connection, channelName, newName, validate }) => {
    const client = createOauthClient({ slackConnection: connection });
    const data = await client.channels.rename({
      channel: util.types.toString(channelName),
      name: util.types.toString(newName),
      validate: util.types.toBool(validate) || undefined,
    });
    return { data };
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
    const client = createOauthClient({ slackConnection: connection });
    const data = await client.channels.archive({
      channel: util.types.toString(channelName),
    });
    return { data };
  },
  inputs: {
    channelName,
    connection: connectionInput,
  },
});
