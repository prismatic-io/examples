import { util } from "@prismatic-io/spectral";
import { SearchChannelType } from "./interfaces";
import { Channel } from "@slack/web-api/dist/response/ConversationsListResponse";

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

export const debugLogger = (params: any) => {
  if (params.debug) {
    const { debug, connection, ...rest } = params;
    console.log("Payload", {
      ...rest,
    });
  }
};

export const getChannelDisplayName = (
  showIdInDropdown: boolean,
  channel: Channel
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
