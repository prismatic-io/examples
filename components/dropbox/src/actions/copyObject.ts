import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { fromPath, toPath, connectionInput } from "../inputs";

export const copyObject = action({
  display: {
    label: "Copy Object",
    description: "Copy a Folder or File from one path to another",
  },
  perform: async (context, { dropboxConnection, fromPath, toPath }) => {
    const dbx = await createAuthorizedClient(dropboxConnection);
    const result = await dbx.filesCopyV2({
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
