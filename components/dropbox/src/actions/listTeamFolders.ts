import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput, directoryPath, limit, cursor } from "../inputs";
import { handleDropboxError } from "../util";

export const listTeamFolder = action({
  display: {
    label: "List Team's Folders",
    description: "List Team's Folder contents",
  },
  perform: async (context, params) => {
    const dbx = await createAuthorizedClient(params.dropboxConnection);

    try {
      const data =
        params.cursor !== ""
          ? await dbx.teamTeamFolderListContinue({
              cursor: util.types.toString(params.cursor),
            })
          : await dbx.teamTeamFolderList({
              limit: util.types.toInt(params.limit) || undefined,
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
  },
  examplePayload: {
    data: {
      status: 200,
      headers: {},
      result: {
        cursor: "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu",
        has_more: false,
        team_folders: [
          {
            content_sync_settings: [
              {
                id: "id:a4ayc_80_OEAAAAAAAAAXw",
                sync_setting: {
                  ".tag": "default",
                },
              },
            ],
            is_team_shared_dropbox: false,
            name: "Marketing",
            status: {
              ".tag": "active",
            },
            sync_setting: {
              ".tag": "default",
            },
            team_folder_id: "123456789",
          },
        ],
      },
    },
  },
});
