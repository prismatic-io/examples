import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput, debug, lookupKey, lookupValue } from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { getTeamInfoPayload } from "../example-payloads";

export const getTeamMembers = action({
  display: {
    label: "Get Team Members",
    description: "Get Team Members by Member ID, External ID, or Email",
  },
  perform: async (context, params) => {
    checkDebug(params, context);
    const dbx = createAuthorizedClient(params.dropboxConnection);
    try {
      const data = await dbx.teamMembersGetInfoV2({
        members: [
          {
            ".tag": params.lookupKey,
            [params.lookupKey]: params.lookupValue,
          },
        ] as any,
      });

      return {
        data,
      };
    } catch (err) {
      handleDropboxError(err);
    }
  },
  inputs: {
    dropboxConnection: connectionInput,
    lookupKey,
    lookupValue,
    debug,
  },
  examplePayload: {
    data: getTeamInfoPayload,
  },
});
