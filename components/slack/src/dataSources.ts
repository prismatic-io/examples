import { dataSource, Element, input, util } from "@prismatic-io/spectral";
import {
  connectionInput,
  includeImChannels,
  includeMultiPartyImchannels,
  includePrivateChannels,
  includePublicChannels,
} from "./inputs";
import { createOauthClient } from "./client";
import { Channel } from "@slack/web-api/dist/response/ConversationsListResponse";
import { generateChannelTypesString } from "./utils";

const selectChannels = dataSource({
  display: {
    label: "Select Channel",
    description:
      "Select a Slack channel from a dropdown menu (up to 10,000 channels)",
  },
  inputs: {
    connection: connectionInput,
    showIdInDropdown: input({
      label: "Show channel ID in dropdown?",
      comments: "Show '#my-channel' vs. '#my-channel (ID: C123456)'",
      type: "boolean",
      default: "false",
      clean: util.types.toBool,
    }),
    includePublicChannels,
    includePrivateChannels,
    includeMultiPartyImchannels,
    includeImChannels,
  },
  perform: async (context, params) => {
    const client = await createOauthClient({
      slackConnection: params.connection,
    });
    let channels: Channel[] = [];
    let cursor = null;
    let counter = 1;

    // Loop over pages of conversations, fetching up to 10,000 channels
    // If we loop more than 10 times, we risk hitting Slack API limits,
    // and returning over 10,000 channels can cause the UI to hang
    do {
      const data = await client.conversations.list({
        exclude_archived: true,
        types: generateChannelTypesString(params),
        cursor,
        limit: 1000,
      });
      channels = [...channels, ...data.channels];
      cursor = data.response_metadata?.next_cursor;
      counter += 1;
    } while (cursor && counter < 10);

    // Map conversations to key/label objects, sorted by name
    const objects = channels
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .map<Element>((channel) => ({
        key: channel.id,
        label: params.showIdInDropdown
          ? `#${channel.name} (ID: ${channel.id})`
          : `#${channel.name}`,
      }));

    return { result: objects };
  },
  dataSourceType: "picklist",
  examplePayload: {
    result: [
      { key: "C123456", label: "#general (ID: C123456)" },
      { key: "C000000", label: "#other-channel (ID: C000000)" },
      { key: "C555555", label: "#random (ID: C555555)" },
    ],
  },
});

export default { selectChannels };
