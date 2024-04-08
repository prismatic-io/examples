import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  teamMemberId,
  userType,
  shared_folder_id,
  fileId,
  debug,
} from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { unshareFilePayload } from "../example-payloads";

export const unshareFile = action({
  display: {
    label: "Unshare File",
    description:
      "Remove all members from this file. Does not remove inherited members.",
  },
  perform: async (
    context,
    { dropboxConnection, teamMemberId, userType, fileId, debug }
  ) => {
    checkDebug(
      { dropboxConnection, teamMemberId, userType, fileId, debug },
      context
    );
    const dbx = createAuthorizedClient(
      dropboxConnection,
      userType,
      teamMemberId
    );
    try {
      const result = await dbx.sharingUnshareFile({
        file: fileId,
      });
      return {
        data: result,
      };
    } catch (err) {
      handleDropboxError(err, [shared_folder_id]);
    }
  },
  inputs: {
    dropboxConnection: connectionInput,
    fileId,
    userType,
    teamMemberId,
    debug,
  },
  examplePayload: {
    data: unshareFilePayload,
  },
});
