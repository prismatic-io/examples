import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  directoryPath,
  limit,
  cursor,
  teamMemberId,
  userType,
} from "../inputs";
import { handleDropboxError } from "../util";

export const listFolder = action({
  display: {
    label: "List Folder",
    description: "List Folder contents at the specified path",
  },
  perform: async (context, params) => {
    const dbx = await createAuthorizedClient(
      params.dropboxConnection,
      params.userType,
      params.teamMemberId
    );

    try {
      const data =
        params.cursor !== ""
          ? await dbx.filesListFolderContinue({
              cursor: util.types.toString(params.cursor),
            })
          : await dbx.filesListFolder({
              path: util.types.toString(params.path),
              limit: util.types.toInt(params.limit) || undefined,
              recursive: util.types.toBool(params.recursive),
            });

      return {
        data,
      };
    } catch (err) {
      handleDropboxError(err, [params.path]);
    }
  },
  inputs: {
    dropboxConnection: connectionInput,
    path: directoryPath,
    cursor,
    limit,
    recursive: {
      label: "Recursive",
      type: "boolean",
      default: false,
      comments: "Recursively list all contents of a directory",
    },
    userType,
    teamMemberId,
  },
  examplePayload: {
    data: {
      status: 200,
      headers: {},
      result: {
        entries: [
          {
            ".tag": "folder",
            id: "exampleId",
            name: "MyExampleFolder",
            path_lower: "/myexamplefolder",
          },
          {
            ".tag": "file",
            id: "exampleId",
            name: "MyImage.jpg",
            path_lower: "/myexamplefolder/myimage.jpg",
            client_modified: new Date("2020-01-01").toUTCString(),
            server_modified: new Date("2020-01-01").toUTCString(),
            rev: "681a01c39731",
            size: 213654,
          },
        ],
        cursor:
          "hgL45HTslKOhj1_GEut-DVuaNs4xrXzpwQZRyJ0-KCW0wWMQ5DZu68__ULJa0zDcBp3ZrMlCj3-ZuOy4kjc9H2o7Ohk9UsId0sxVZrXFX",
        has_more: true,
      },
    },
  },
});
