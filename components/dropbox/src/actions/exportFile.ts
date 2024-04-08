import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  debug,
  directoryPath,
  teamMemberId,
  userType,
} from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { exportFilePayload } from "../example-payloads";

export const exportFile = action({
  display: {
    label: "Export File",
    description: "Export the file at the specified path",
  },
  perform: async (context, params) => {
    checkDebug(params, context);
    const dbx = createAuthorizedClient(
      params.dropboxConnection,
      params.userType,
      params.teamMemberId
    );

    try {
      const data = await dbx.filesExport({
        path: params.path,
      });

      return {
        data,
      };
    } catch (err) {
      handleDropboxError(err, [params.path]);
    }
  },
  inputs: {
    dropboxConnection: connectionInput,
    path: {
      ...directoryPath,
      required: true,
      comments: "The path of the file to be exported.",
      example: "/Homework/math/Prime_Numbers.gsheet",
    },
    userType,
    teamMemberId,
    debug,
  },
  examplePayload: {
    data: exportFilePayload,
  },
});
