import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput, path } from "../inputs";
import mime from "mime-types";
import { basename } from "path";
import { files } from "dropbox";
import { handleDropboxError, validatePath } from "../util";

export const downloadFile = action({
  display: {
    label: "Download File",
    description: "Download the file (< 150MB) at the specified path",
  },
  perform: async (context, { dropboxConnection, path }) => {
    validatePath(path);
    const dbx = await createAuthorizedClient(dropboxConnection);
    try {
      const { result } = await dbx.filesDownload({
        path: util.types.toString(path),
      });
      return {
        // From the Dropbox SDK code:
        // https://github.com/dropbox/dropbox-sdk-js/blob/b5631e4b5b0e9eb6d3297e1ee57ad29a63d49898/examples/typescript/node/download.ts
        //   Note: The fileBinary field is not part of the Dropbox SDK
        //   specification, so it is not included in the TypeScript type.
        //   It is injected by the SDK.
        data: (result as files.FileMetadata & { fileBinary: Buffer })
          .fileBinary,
        contentType: mime.lookup(basename(result.path_lower)) || mime.types.bin,
      };
    } catch (err) {
      handleDropboxError(err, [path]);
    }
  },
  inputs: { dropboxConnection: connectionInput, path },
  examplePayload: {
    data: Buffer.from("example"),
    contentType: "application/octet",
  },
});
