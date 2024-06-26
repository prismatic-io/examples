import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  directoryPath,
  limit,
  cursor,
  debug,
} from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { listTeamFoldersPayload } from "../example-payloads";

export const listTeamFolder = action({
  display: {
    label: "List Team's Folders",
    description: "List Team's Folder contents",
  },
  perform: async (context, params) => {
    checkDebug(params, context);
    const dbx = createAuthorizedClient(params.dropboxConnection);

    try {
      const data =
        params.cursor !== ""
          ? await dbx.teamTeamFolderListContinue({
              cursor: params.cursor,
            })
          : await dbx.teamTeamFolderList({
              limit: params.limit || undefined,
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
    path: directoryPath,
    cursor,
    limit,
    debug,
  },
  examplePayload: {
    data: listTeamFoldersPayload,
  },
});
