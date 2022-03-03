import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput, path, fileContents } from "../inputs";
import { handleDropboxError, validatePath } from "../util";

export const uploadFile = action({
  display: {
    label: "Upload File",
    description: "Upload a file to the specified path",
  },
  perform: async (context, { dropboxConnection, path, fileContents }) => {
    validatePath(path);
    const dbx = await createAuthorizedClient(dropboxConnection);
    const { data } = util.types.toData(fileContents);
    try {
      const result = await dbx.filesUpload({
        path: util.types.toString(path),
        contents: data,
        mode: { ".tag": "overwrite" },
      });
      return {
        data: result,
      };
    } catch (err) {
      handleDropboxError(err, [path]);
    }
  },
  inputs: { dropboxConnection: connectionInput, path, fileContents },
  examplePayload: {
    data: {
      status: 200,
      headers: {},
      result: {
        id: "exampleId",
        client_modified: new Date("2020-01-01").toUTCString(),
        server_modified: new Date("2020-01-01").toUTCString(),
        rev: undefined,
        size: 2048,
        name: "myFileName",
      },
    },
  },
});
