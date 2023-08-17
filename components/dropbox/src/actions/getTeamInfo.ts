import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput } from "../inputs";
import { handleDropboxError } from "../util";

export const getTeamMembers = action({
  display: {
    label: "Get Team Members",
    description: "Get Team Members by Member ID, External ID, or Email",
  },
  perform: async (context, params) => {
    const dbx = await createAuthorizedClient(params.dropboxConnection);
    try {
      const data = await dbx.teamMembersGetInfoV2({
        members: [
          { ".tag": params.lookupKey, [params.lookupKey]: params.lookupValue },
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
    lookupKey: {
      label: "Lookup By",
      type: "string",
      required: true,
      model: [
        { label: "Email", value: "email" },
        { label: "Team Member Id", value: "team_member_id" },
        { label: "External ID", value: "external_id" },
      ],
      clean: util.types.toString,
    },
    lookupValue: {
      label: "Value",
      type: "string",
      required: true,
      clean: util.types.toString,
    },
  },
});
