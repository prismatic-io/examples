import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { path, connectionInput } from "../inputs";
import { handleDropboxError, validatePath } from "../util";

export const deleteObject = action({
  display: {
    label: "Delete Object",
    description: "Delete a Folder or File at the specified path",
  },
  perform: async (context, { dropboxConnection, path }) => {
    validatePath(path);
    const dbx = await createAuthorizedClient(dropboxConnection);
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
  inputs: { dropboxConnection: connectionInput, path },
  examplePayload: {
    data: {
      status: 200,
      headers: {},
      result: {
        metadata: {
          ".tag": "file",
          name: "myCopy",
          id: "exampleId",
          client_modified: new Date("2020-01-01").toUTCString(),
          server_modified: new Date("2020-01-01").toUTCString(),
          rev: undefined,
          size: 2048,
        },
      },
    },
  },
});
