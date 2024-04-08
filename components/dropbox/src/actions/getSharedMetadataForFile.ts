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
import { getSharedMetadataForFilePayload } from "../example-payloads";

export const getSharedMetadataForFile = action({
  display: {
    label: "Get Shared Metadata for File",
    description: "Returns shared file metadata.",
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
      const result = await dbx.sharingGetFileMetadata({
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
    data: getSharedMetadataForFilePayload,
  },
});
