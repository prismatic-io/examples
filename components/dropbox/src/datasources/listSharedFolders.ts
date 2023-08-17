import { dataSource, Element, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  directoryPath,
  limit,
  cursor,
  folderActions,
} from "../inputs";
import { handleDropboxError } from "../util";

export const listSharedFolders = dataSource({
  display: {
    label: "List Shared Folders",
    description: "Fetch an array of shared folders",
  },
  inputs: {
    connection: connectionInput,
    path: directoryPath,
    cursor,
    limit,
    folderActions,
  },
  perform: async (context, params) => {
    const dbx = createAuthorizedClient(params.connection);
    try {
      const {
        result: { entries },
      } =
        params.cursor !== ""
          ? await dbx.sharingListFoldersContinue({
              cursor: util.types.toString(params.cursor),
            })
          : await dbx.sharingListFolders({
              limit: util.types.toInt(params.limit) || undefined,
              actions: params.folderActions,
            });

      const result = entries.map<Element>((folder) => ({
        label: folder.name,
        key: folder.shared_folder_id,
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
