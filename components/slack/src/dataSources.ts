import { dataSource, Element } from "@prismatic-io/spectral";
import { connectionInput } from "./inputs";
import { createOauthClient } from "./client";

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
    const data = await client.conversations.list({
      exclude_archived: true,
      limit: 1000, // todo: implement paging over results
    });
    const objects = data.channels.map<Element>((channel) => ({
      key: channel.id,
      label: channel.name,
    }));
    return { result: objects };
  },
  dataSourceType: "picklist",
  examplePayload: {
    result: [
      { key: "C123456", label: "general" },
      { key: "C000000", label: "other-channel" },
    ],
  },
});

export default { selectChannels };
