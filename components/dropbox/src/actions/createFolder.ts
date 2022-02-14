import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { path, connectionInput } from "../inputs";

export const createFolder = action({
  display: {
    label: "Create Folder",
    description: "Create a Folder at the specified path",
  },
  perform: async (context, { dropboxConnection, path }) => {
    const dbx = await createAuthorizedClient(dropboxConnection);
    const result = await dbx.filesCreateFolderV2({
      path: util.types.toString(path),
    });
    return {
      data: result,
    };
  },
  inputs: { dropboxConnection: connectionInput, path },
  examplePayload: {
    data: {
      metadata: { id: "exampleId", name: "myFolderName" },
    },
  },
});
