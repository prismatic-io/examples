import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { path, connectionInput, debug } from "../inputs";
import { checkDebug, handleDropboxError, validatePath } from "../util";
import { createFolderPayload } from "../example-payloads";

export const createFolder = action({
  display: {
    label: "Create Folder",
    description: "Create a Folder at the specified path",
  },
  perform: async (context, { dropboxConnection, path, debug }) => {
    checkDebug({ dropboxConnection, path, debug }, context);
    validatePath(path);
    const dbx = createAuthorizedClient(dropboxConnection);
    try {
      const result = await dbx.filesCreateFolderV2({
        path: util.types.toString(path),
      });
      return {
        data: result,
      };
    } catch (err) {
      handleDropboxError(err, [path]);
    }
  },
  inputs: { dropboxConnection: connectionInput, path, debug },
  examplePayload: {
    data: createFolderPayload,
  },
});
