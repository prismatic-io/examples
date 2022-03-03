import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { path, connectionInput } from "../inputs";
import { handleDropboxError, validatePath } from "../util";

export const createFolder = action({
  display: {
    label: "Create Folder",
    description: "Create a Folder at the specified path",
  },
  perform: async (context, { dropboxConnection, path }) => {
    validatePath(path);
    const dbx = await createAuthorizedClient(dropboxConnection);
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
  inputs: { dropboxConnection: connectionInput, path },
  examplePayload: {
    data: {
      status: 200,
      headers: {},
      result: {
        metadata: { id: "exampleId", name: "myFolderName" },
      },
    },
  },
});
