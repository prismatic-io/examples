import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  teamMemberId,
  userType,
  shared_folder_id,
  include_media_info,
  include_deleted,
  include_has_explicit_shared_members,
  debug,
} from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { path } from "../inputs";
import { getFileOrFolderMetadataPayload } from "../example-payloads";

export const getMetadata = action({
  display: {
    label: "Get Metadata for File or Folder",
    description: "Returns the metadata for a file or folder.",
  },
  perform: async (
    context,
    {
      dropboxConnection,
      teamMemberId,
      userType,
      include_deleted,
      include_has_explicit_shared_members,
      include_media_info,
      path,
      debug,
    }
  ) => {
    checkDebug(
      {
        dropboxConnection,
        teamMemberId,
        userType,
        include_deleted,
        include_has_explicit_shared_members,
        include_media_info,
        path,
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
      const result = await dbx.filesGetMetadata({
        path,
        include_deleted,
        include_has_explicit_shared_members,
        include_media_info,
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
    path: {
      ...path,
      comments: "The path of a file or folder on Dropbox to get metadata for",
      example: "id:a4ayc_80_OEAAAAAAAAAYa || /Homework/math",
      required: true,
    },
    include_media_info,
    include_deleted,
    include_has_explicit_shared_members,
    userType,
    teamMemberId,
    debug,
  },
  examplePayload: {
    data: getFileOrFolderMetadataPayload,
  },
});
