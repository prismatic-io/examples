import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { path, connectionInput } from "../inputs";

export const deleteObject = action({
  display: {
    label: "Delete Object",
    description: "Delete a Folder or File at the specified path",
  },
  perform: async (context, { dropboxConnection, path }) => {
    const dbx = await createAuthorizedClient(dropboxConnection);
    const result = await dbx.filesDeleteV2({
      path: util.types.toString(path),
    });
    return {
      data: result,
    };
  },
  inputs: { dropboxConnection: connectionInput, path },
  examplePayload: {
    data: {
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
});
