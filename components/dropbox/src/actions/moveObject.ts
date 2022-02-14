import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput, fromPath, toPath } from "../inputs";

export const moveObject = action({
  display: {
    label: "Move Object",
    description: "Move a Folder or File from one path to another",
  },
  perform: async (context, { dropboxConnection, fromPath, toPath }) => {
    const dbx = await createAuthorizedClient(dropboxConnection);
    const result = await dbx.filesMoveV2({
      from_path: util.types.toString(fromPath),
      to_path: util.types.toString(toPath),
    });
    return {
      data: result,
    };
  },
  inputs: { dropboxConnection: connectionInput, fromPath, toPath },
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
