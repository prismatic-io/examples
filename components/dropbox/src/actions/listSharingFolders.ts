import { action } from "@prismatic-io/spectral";
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
import { listSharingFoldersPayload } from "../example-payloads";

export const listSharingFolder = action({
  display: {
    label: "List Sharing Folder's",
    description: "List Sharing Folder contents",
  },
  perform: async (context, params) => {
    checkDebug(params, context);
    const dbx = createAuthorizedClient(params.dropboxConnection);

    try {
      const data =
        params.cursor !== ""
          ? await dbx.sharingListFoldersContinue({
              cursor: params.cursor,
            })
          : await dbx.sharingListFolders({
              limit: params.limit || undefined,
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
    path: directoryPath,
    cursor,
    limit,
    folderActions,
    debug,
  },
  examplePayload: {
    data: listSharingFoldersPayload,
  },
});
