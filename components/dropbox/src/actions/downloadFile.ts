import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput, path } from "../inputs";
import mime from "mime-types";
import { basename } from "path";

export const downloadFile = action({
  display: {
    label: "Download File",
    description: "Download the file (< 150MB) at the specified path",
  },
  perform: async (context, { dropboxConnection, path }) => {
    path = util.types.toString(path);
    const dbx = await createAuthorizedClient(dropboxConnection);
    const { result } = await dbx.filesDownload({
      path: util.types.toString(path),
    });
    return {
      data: result.fileBinary,
      contentType: mime.lookup(basename(result.path_lower)) || mime.types.bin,
    };
  },
  inputs: { dropboxConnection: connectionInput, path },
  examplePayload: {
    data: Buffer.from("example"),
    contentType: "application/octet",
  },
});
