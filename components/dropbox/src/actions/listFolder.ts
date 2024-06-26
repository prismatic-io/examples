import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  directoryPath,
  limit,
  cursor,
  teamMemberId,
  userType,
  recursive,
  debug,
} from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { listFolderPayload } from "../example-payloads";

export const listFolder = action({
  display: {
    label: "List Folder",
    description: "List Folder contents at the specified path",
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
          ? await dbx.filesListFolderContinue({
              cursor: util.types.toString(params.cursor),
            })
          : await dbx.filesListFolder({
              path: util.types.toString(params.path),
              limit: util.types.toInt(params.limit) || undefined,
              recursive: util.types.toBool(params.recursive),
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
    recursive,
    userType,
    teamMemberId,
    debug,
  },
  examplePayload: {
    data: listFolderPayload,
  },
});
