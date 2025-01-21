import { util } from "@prismatic-io/spectral";
import { SearchChannelType } from "./interfaces";
import { WebClient } from "@slack/web-api";
import { Channel } from "@slack/web-api/dist/types/response/ConversationsListResponse";

interface GenerateChannelTypesParams {
  includePublicChannels: boolean;
  includePrivateChannels: boolean;
  includeMultiPartyImchannels: boolean;
  includeImChannels: boolean;
}

export const generateChannelTypesString = ({
  includePublicChannels,
  includePrivateChannels,
  includeMultiPartyImchannels,
  includeImChannels,
}: GenerateChannelTypesParams) => {
  const types = [];
  if (includePublicChannels) {
    types.push("public_channel");
  }
  if (includePrivateChannels) {
    types.push("private_channel");
  }
  if (includeMultiPartyImchannels) {
    types.push("mpim");
  }
  if (includeImChannels) {
    types.push("im");
  }
  return types.join(",");
};

export const isValidArrayNotEmpty = (value: unknown) => {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.map((v) => util.types.toString(v)).filter((v) => v !== "");
};

export const valueListInputClean = (value: unknown) => {
  if (value) {
    const data = isValidArrayNotEmpty(value);
    if (data) {
      return data as SearchChannelType;
    }
    const isStringNotEmpty = util.types.toString(value).trim();
    const parsedValue = JSON.parse(isStringNotEmpty);
    const parsedData = isValidArrayNotEmpty(parsedValue);
    if (parsedData) {
      return parsedData as SearchChannelType;
    }
  }
  return undefined;
};

export const debugLogger = (params: Record<string, unknown>) => {
  if (params.debug) {
    const { ...rest } = params;
    console.log("Payload", {
      ...rest,
    });
  }
};

export const getChannelDisplayName = (
  showIdInDropdown: boolean,
  channel: Channel,
): string => {
  let channelName: string;
  const isImChannel = channel.is_im || channel.is_mpim;

  if (channel.name) {
    channelName = channel.name;
  } else if (isImChannel) {
    channelName = "IM Channel";
  } else {
    channelName = "Unnamed";
  }

  if (showIdInDropdown) {
    return `#${channelName} (ID: ${channel.id})`;
  } else {
    return `#${channelName}`;
  }
};

export const paginateResults = async (
  client: WebClient,
  object: string,
  returnObject: string,
  method: string,
  params: Record<string, unknown>,
) => {
  let cursor;
  const toReturn = [];
  do {
    const data = await client[object][method]({
      ...params,
      cursor: cursor,
      limit: 50,
    });

    cursor = data.response_metadata.next_cursor;
    toReturn.push(...data[returnObject]);
  } while (cursor);

  return {
    data: {
      ok: true,
      [returnObject]: toReturn,
    },
  };
};
