import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput, fromPath, toPath } from "../inputs";
import { handleDropboxError, validatePath } from "../util";

export const moveObject = action({
  display: {
    label: "Move Object",
    description: "Move a Folder or File from one path to another",
  },
  perform: async (context, { dropboxConnection, fromPath, toPath }) => {
    validatePath(fromPath);
    validatePath(toPath);
    const dbx = await createAuthorizedClient(dropboxConnection);
    try {
      const result = await dbx.filesMoveV2({
        from_path: util.types.toString(fromPath),
        to_path: util.types.toString(toPath),
      });
      return {
        data: result,
      };
    } catch (err) {
      handleDropboxError(err, [fromPath, toPath]);
    }
  },
  inputs: { dropboxConnection: connectionInput, fromPath, toPath },
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
