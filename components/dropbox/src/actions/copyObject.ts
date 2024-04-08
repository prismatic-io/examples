import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { fromPath, toPath, connectionInput, debug } from "../inputs";
import { checkDebug, handleDropboxError, validatePath } from "../util";
import { copyObjectPayload } from "../example-payloads";

export const copyObject = action({
  display: {
    label: "Copy Object",
    description: "Copy a Folder or File from one path to another",
  },
  perform: async (context, { dropboxConnection, fromPath, toPath, debug }) => {
    checkDebug({ dropboxConnection, fromPath, toPath, debug }, context);
    validatePath(fromPath);
    validatePath(toPath);
    const dbx = createAuthorizedClient(dropboxConnection);
    try {
      const result = await dbx.filesCopyV2({
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
  inputs: { dropboxConnection: connectionInput, fromPath, toPath, debug },
  examplePayload: {
    data: copyObjectPayload,
  },
});
