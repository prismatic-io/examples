import { action, input, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput, limit, cursor } from "../inputs";

const path = input({
  label: "Directory Path",
  placeholder: "Directory Path Prefix",
  type: "string",
  required: false,
  comments:
    "The path to a directory within a Dropbox share. Include a leading /.",
  example: "/path/to/my/directory/",
});

export const listFolder = action({
  display: {
    label: "List Folder",
    description: "List Folder contents at the specified path",
  },
  perform: async (context, params) => {
    // path may be left undefined to indicate the root folder
    const dirPath = util.types.toString(params.path).replace(/\/$/, "");
    const dbx = await createAuthorizedClient(params.dropboxConnection);

    const data =
      params.cursor !== ""
        ? await dbx.filesListFolderContinue({
            cursor: util.types.toString(params.cursor),
          })
        : await dbx.filesListFolder({
            path: util.types.toString(dirPath),
            limit: util.types.toInt(params.limit) || undefined,
          });

    return {
      data,
    };
  },
  inputs: { dropboxConnection: connectionInput, path, cursor, limit },
  examplePayload: {
    data: {
      status: "200",
      headers: {},
      result: {
        entries: [
          {
            ".tag": "folder",
            name: "MyExampleFolder",
            path_lower: "/myexamplefolder",
          },
          {
            ".tag": "folder",
            name: "MyExampleFolder",
            path_lower: "/myexamplefolder",
          },
        ],
        cursor:
          "hgL45HTslKOhj1_GEut-DVuaNs4xrXzpwQZRyJ0-KCW0wWMQ5DZu68__ULJa0zDcBp3ZrMlCj3-ZuOy4kjc9H2o7Ohk9UsId0sxVZrXFX",
        hasMore: true,
      },
    },
  },
});
