import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  teamMemberId,
  userType,
  shared_folder_id,
  leave_a_copy,
  debug,
} from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { unshareFolderPayload } from "../example-payloads";

export const unshareFolder = action({
  display: {
    label: "Unshare Folder",
    description:
      "Allows a shared folder owner to unshare the folder. Unshare will not work in following cases: The shared folder contains shared folders OR the shared folder is inside another shared folder.",
  },
  perform: async (
    context,
    {
      dropboxConnection,
      leave_a_copy,
      shared_folder_id,
      teamMemberId,
      userType,
      debug,
    }
  ) => {
    checkDebug(
      {
        dropboxConnection,
        leave_a_copy,
        shared_folder_id,
        teamMemberId,
        userType,
        debug,
      },
      context
    );
    const dbx = createAuthorizedClient(
      dropboxConnection,
      userType,
      teamMemberId
    );
    try {
      const result = await dbx.sharingUnshareFolder({
        shared_folder_id,
        leave_a_copy,
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
    shared_folder_id,
    leave_a_copy,
    userType,
    teamMemberId,
    debug,
  },
  examplePayload: {
    data: unshareFolderPayload,
  },
});
