import { dataSource, Element, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  directoryPath,
  limit,
  cursor,
  teamMemberId,
  userType,
  recursive,
} from "../inputs";
import { handleDropboxError } from "../util";

export const listFolders = dataSource({
  display: {
    label: "List Folders",
    description: "Fetch an array of folders",
  },
  inputs: {
    connection: connectionInput,
    path: directoryPath,
    cursor,
    limit,
    recursive,
    userType,
    teamMemberId,
  },
  perform: async (context, params) => {
    const dbx = createAuthorizedClient(params.connection);
    try {
      const {
        result: { entries },
      } =
        params.cursor !== ""
          ? await dbx.filesListFolderContinue({
              cursor: util.types.toString(params.cursor),
            })
          : await dbx.filesListFolder({
              path: util.types.toString(params.path),
              limit: util.types.toInt(params.limit) || undefined,
              recursive: util.types.toBool(params.recursive),
            });

      const result = entries.map<Element>((folder) => ({
        label: folder.name,
        key: (folder as any).id,
      }));
      return { result };
    } catch (err) {
      handleDropboxError(err, [params.path]);
    }
  },
  dataSourceType: "picklist",
  examplePayload: {
    result: [
      { label: "/myexamplefolder - MyExampleFolder", key: "0" },
      { label: "/myexamplefolder/myimage.jpg - MyImage.jpg", key: "1" },
    ],
  },
});
