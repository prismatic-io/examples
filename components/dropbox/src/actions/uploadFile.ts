import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput, path, fileContents, debug } from "../inputs";
import { checkDebug, handleDropboxError, validatePath } from "../util";
import { uploadFilePayload } from "../example-payloads";

export const uploadFile = action({
  display: {
    label: "Upload File",
    description: "Upload a file to the specified path",
  },
  perform: async (
    context,
    { dropboxConnection, path, fileContents, debug }
  ) => {
    checkDebug({ dropboxConnection, path, fileContents, debug }, context);
    validatePath(path);
    const dbx = createAuthorizedClient(dropboxConnection);
    const { data } = fileContents;
    try {
      const result = await dbx.filesUpload({
        path: path,
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
  inputs: { dropboxConnection: connectionInput, path, fileContents, debug },
  examplePayload: {
    data: uploadFilePayload,
  },
});
