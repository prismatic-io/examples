import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  directoryPath,
  limit,
  cursor,
  teamMemberId,
  userType,
  fileName,
  debug,
} from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { searchFilesPayload } from "../example-payloads";

export const searchFiles = action({
  display: {
    label: "Search Files",
    description: "Search for files at the specified path",
  },
  perform: async (context, params) => {
    checkDebug(params, context);
    const dbx = createAuthorizedClient(
      params.dropboxConnection,
      params.userType,
      params.teamMemberId
    );

    try {
      const data =
        params.cursor !== ""
          ? await dbx.filesSearchContinueV2({
              cursor: params.cursor,
            })
          : await dbx.filesSearchV2({
              query: params.query,
              options: {
                filename_only: true,
                max_results: params.limit,
                path: params.path,
              },
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
    query: { ...fileName, required: true },
    path: directoryPath,
    cursor,
    limit,
    userType,
    teamMemberId,
    debug,
  },
  examplePayload: {
    data: searchFilesPayload,
  },
});
