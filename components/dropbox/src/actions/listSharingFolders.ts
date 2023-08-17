import { action, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  directoryPath,
  limit,
  cursor,
  folderActions,
} from "../inputs";
import { handleDropboxError } from "../util";

export const listSharingFolder = action({
  display: {
    label: "List Sharing Folder's",
    description: "List Sharing Folder contents",
  },
  perform: async (context, params) => {
    const dbx = await createAuthorizedClient(params.dropboxConnection);

    try {
      const data =
        params.cursor !== ""
          ? await dbx.sharingListFoldersContinue({
              cursor: util.types.toString(params.cursor),
            })
          : await dbx.sharingListFolders({
              limit: util.types.toInt(params.limit) || undefined,
              actions: params.folderActions,
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
    folderActions,
  },
  examplePayload: {
    data: {
      status: 200,
      headers: {},
      result: {
        cursor: "ZtkX9_EHj3x7PMkVuFIhwKYXEpwpLwyxp9vMKomUhllil9q7eWiAu",
        entries: [
          {
            access_inheritance: {
              ".tag": "inherit",
            },
            access_type: {
              ".tag": "owner",
            },
            is_inside_team_folder: false,
            is_team_folder: false,
            link_metadata: {
              audience_options: [
                {
                  ".tag": "public",
                },
                {
                  ".tag": "team",
                },
                {
                  ".tag": "members",
                },
              ],
              current_audience: {
                ".tag": "public",
              },
              link_permissions: [
                {
                  action: {
                    ".tag": "change_audience",
                  },
                  allow: true,
                },
              ],
              password_protected: false,
              url: "",
            },
            name: "dir",
            path_lower: "/dir",
            permissions: [],
            policy: {
              acl_update_policy: {
                ".tag": "owner",
              },
              member_policy: {
                ".tag": "anyone",
              },
              resolved_member_policy: {
                ".tag": "team",
              },
              shared_link_policy: {
                ".tag": "anyone",
              },
            },
            preview_url: "https://www.dropbox.com/scl/fo/fir9vjelf",
            shared_folder_id: "84528192421",
            time_invited: "2016-01-20T00:00:00Z",
          },
        ],
      },
    },
  },
});
