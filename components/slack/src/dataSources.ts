import { dataSource, Element } from "@prismatic-io/spectral";
import { connectionInput } from "./inputs";
import { createOauthClient } from "./client";
import { Channel } from "@slack/web-api/dist/response/ConversationsListResponse";

const selectChannels = dataSource({
  display: {
    label: "Select Channel",
    description: "Select a Slack channel from a dropdown menu",
  },
  inputs: {
    connection: connectionInput,
  },
  perform: async (context, params) => {
    const client = createOauthClient({ slackConnection: params.connection });
    let channels: Channel[] = [];
    let cursor = null;

    // Loop over pages of conversations
    do {
      const data = await client.conversations.list({
        exclude_archived: true,
        types: "public_channel,private_channel",
        cursor,
        limit: 1000,
      });
      channels = [...channels, ...data.channels];
      cursor = data.response_metadata?.next_cursor;
    } while (cursor);

    // Map conversations to key/label objects, sorted by name
    const objects = channels
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .map<Element>((channel) => ({
        key: channel.id,
        label: `#${channel.name} (id: ${channel.id})`,
      }));

    return { result: objects };
  },
  dataSourceType: "picklist",
  examplePayload: {
    result: [
      { key: "C123456", label: "#general (id: C123456)" },
      { key: "C000000", label: "#other-channel (id: C000000)" },
      { key: "C555555", label: "#random (id: C555555)" },
    ],
  },
});

export default { selectChannels };
