import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { path, connectionInput, debug } from "../inputs";
import { checkDebug, handleDropboxError, validatePath } from "../util";
import { deleteObjectPayload } from "../example-payloads";

export const deleteObject = action({
  display: {
    label: "Delete Object",
    description: "Delete a Folder or File at the specified path",
  },
  perform: async (context, { dropboxConnection, path, debug }) => {
    checkDebug(
      {
        dropboxConnection,
        path,
        debug,
      },
      context
    );
    validatePath(path);
    const dbx = createAuthorizedClient(dropboxConnection);
    try {
      const result = await dbx.filesDeleteV2({
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
    data: deleteObjectPayload,
  },
});
