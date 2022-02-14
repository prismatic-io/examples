import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput, path, fileContents } from "../inputs";

export const uploadFile = action({
  display: {
    label: "Upload File",
    description: "Upload a file to the specified path",
  },
  perform: async (context, { dropboxConnection, path, fileContents }) => {
    const dbx = await createAuthorizedClient(dropboxConnection);

    const { data } = util.types.toData(fileContents);
    const result = await dbx.filesUpload({
      path: util.types.toString(path),
      contents: data,
      mode: { ".tag": "overwrite" },
    });
    return {
      data: result,
    };
  },
  inputs: { dropboxConnection: connectionInput, path, fileContents },
  examplePayload: {
    data: {
      id: "exampleId",
      client_modified: new Date("2020-01-01").toUTCString(),
      server_modified: new Date("2020-01-01").toUTCString(),
      rev: undefined,
      size: 2048,
      name: "myFileName",
    },
  },
});
