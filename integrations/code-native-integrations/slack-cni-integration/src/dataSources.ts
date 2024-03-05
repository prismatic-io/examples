import {
  Connection,
  Element,
  dataSourceConfigVar,
} from "@prismatic-io/spectral";
import { createSlackClient } from "./slackClient";
import { AxiosResponse } from "axios";

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
  stableKey: "2BB5F3A9-9CFF-4DE4-8004-ECACDE6D03E3",
  dataSourceType: "picklist",
  perform: async (context) => {
    const client = createSlackClient(
      context.configVars["Slack OAuth Connection"] as Connection
    );
    let channels: Channel[] = [];
    let cursor = null;
    let counter = 1;
    // Loop over pages of conversations, fetching up to 10,000 channels
    // If we loop more than 10 times, we risk hitting Slack API limits,
    // and returning over 10,000 channels can cause the UI to hang
    do {
      const response: AxiosResponse<ListChannelsResponse> = await client.get(
        "conversations.list",
        {
          params: {
            exclude_archived: true,
            types: "public_channel",
            cursor,
            limit: 1000,
          },
        }
      );
      if (!response.data.ok) {
        throw new Error(
          `Error when fetching data from Slack: ${response.data}`
        );
      }
      channels = [...channels, ...response.data.channels];
      cursor = response.data.response_metadata?.next_cursor;
      counter += 1;
    } while (cursor && counter < 10);
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
