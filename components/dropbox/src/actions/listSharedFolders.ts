import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  directoryPath,
  limit,
  cursor,
  folderActions,
  debug,
} from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { listSharedFoldersPayload } from "../example-payloads";

export const listSharingFolder = action({
  display: {
    label: "List Shared Folders",
    description: "List Shared Folders contents",
  },
  perform: async (context, params) => {
    checkDebug(params, context);
    const dbx = createAuthorizedClient(params.dropboxConnection);

    try {
      const data =
        params.cursor !== ""
          ? await dbx.sharingListFoldersContinue({
              cursor: util.types.toString(params.cursor),
            })
          : await dbx.sharingListFolders({
              limit: util.types.toInt(params.limit) || undefined,
              actions: params.folderActions,
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
    path: { ...directoryPath, required: true },
    cursor,
    limit,
    folderActions,
    debug,
  },
  examplePayload: {
    data: listSharedFoldersPayload,
  },
});
