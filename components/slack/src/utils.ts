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
