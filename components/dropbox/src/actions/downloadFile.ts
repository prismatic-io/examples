import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput, debug, download_as_zip, path } from "../inputs";
import * as mime from "mime-types";
import { basename } from "path";
import { files } from "dropbox";
import { checkDebug, handleDropboxError, validatePath } from "../util";
import { downloadFilePayload } from "../example-payloads";

export const downloadFile = action({
  display: {
    label: "Download File",
    description: "Download the file (< 150MB) at the specified path",
  },
  perform: async (
    context,
    { dropboxConnection, path, debug, download_as_zip }
  ) => {
    checkDebug(
      {
        dropboxConnection,
        path,
        debug,
        download_as_zip,
      },
      context
    );
    validatePath(path);
    const dbx = createAuthorizedClient(dropboxConnection);
    try {
      if (download_as_zip) {
        const { result } = await dbx.filesDownloadZip({
          path,
        });
        return {
          data: result,
          contentType: "application/zip",
        };
      } else {
        const { result } = await dbx.filesDownload({
          path,
        });

        return {
          // From the Dropbox SDK code:
          // https://github.com/dropbox/dropbox-sdk-js/blob/b5631e4b5b0e9eb6d3297e1ee57ad29a63d49898/examples/typescript/node/download.ts
          //   Note: The fileBinary field is not part of the Dropbox SDK
          //   specification, so it is not included in the TypeScript type.
          //   It is injected by the SDK.
          data: (result as files.FileMetadata & { fileBinary: Buffer })
            .fileBinary,
          contentType:
            mime.lookup(basename(result.path_lower)) || mime.types.bin,
        };
      }
    } catch (err) {
      handleDropboxError(err, [path]);
    }
  },
  inputs: { dropboxConnection: connectionInput, path, download_as_zip, debug },
  examplePayload: downloadFilePayload,
});
