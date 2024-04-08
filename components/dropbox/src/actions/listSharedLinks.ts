import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  directoryPath,
  cursor,
  teamMemberId,
  userType,
  direct_only,
  debug,
} from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { listSharedLinksPayload } from "../example-payloads";

export const listSharedLinks = action({
  display: {
    label: "List Shared Links",
    description: "List Folder contents at the specified path",
  },
  perform: async (context, params) => {
    checkDebug(params, context);
    const dbx = createAuthorizedClient(
      params.dropboxConnection,
      params.userType,
      params.teamMemberId
    );

    try {
      const data =
        params.cursor !== ""
          ? await dbx.sharingListSharedLinks({
              cursor: params.cursor,
            })
          : await dbx.sharingListSharedLinks({
              path: params.path,
              direct_only: params.direct_only,
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
    direct_only,
    cursor,
    userType,
    teamMemberId,
    debug,
  },
  examplePayload: {
    data: listSharedLinksPayload,
  },
});
