import { type Connection, dataSourceConfigVar, type Element } from "@prismatic-io/spectral";
import type { AxiosResponse } from "axios";
import { createSlackClient } from "./slackClient";

interface Channel {
  id: string;
  name: string;
}

interface ListChannelsResponse {
  ok: boolean;
  channels: Channel[];
  response_metadata?: {
    next_cursor: string;
  };
}

export const slackSelectChannelDataSource = dataSourceConfigVar({
  stableKey: "slack-channel-selection",
  dataSourceType: "picklist",
  perform: async (context) => {
    const client = createSlackClient(context.configVars["Slack OAuth Connection"] as Connection);
    let channels: Channel[] = [];
    let cursor = null;
    let page = 0;
    // Loop over pages of conversations, fetching up to 10,000 channels
    // If we loop more than 10 times, we risk hitting Slack API limits,
    // and returning over 10,000 channels can cause the UI to hang
    do {
      const response: AxiosResponse<ListChannelsResponse> = await client.get("conversations.list", {
        params: {
          exclude_archived: true,
          types: "public_channel",
          cursor,
          limit: 1000,
        },
      });
      if (!response.data.ok) {
        throw new Error(`Error when fetching data from Slack: ${JSON.stringify(response.data)}`);
      }
      channels = [...channels, ...response.data.channels];
      cursor = response.data.response_metadata?.next_cursor;
      page += 1;
    } while (cursor && page < 10);
    // Map conversations to key/label objects, sorted by name
    const objects = channels
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .map<Element>((channel) => ({
        key: channel.id,
        label: channel.name,
      }));
    return { result: objects };
  },
});
