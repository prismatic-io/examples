import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  access_inheritance,
  acl_update_policy,
  actions,
  connectionInput,
  debug,
  directoryPath,
  force_async,
  member_policy,
  shared_link_policy,
  teamMemberId,
  userType,
  viewer_info_policy,
} from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { shareFolderPayload } from "../example-payloads";

export const shareFolder = action({
  display: {
    label: "Share Folder",
    description:
      "Share a folder with collaborators. Most sharing will be completed synchronously. Large folders will be completed asynchronously.",
  },
  perform: async (context, params) => {
    checkDebug(params, context);
    const dbx = createAuthorizedClient(
      params.dropboxConnection,
      params.userType,
      params.teamMemberId
    );

    try {
      const data = await dbx.sharingShareFolder({
        path: params.path,
        force_async: params.force_async,
        access_inheritance: params.access_inheritance as any,
        acl_update_policy: params.acl_update_policy as any,
        member_policy: params.member_policy as any,
        shared_link_policy: params.shared_link_policy as any,
        viewer_info_policy: params.viewer_info_policy as any,
        actions: params.actions as any,
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
    path: {
      ...directoryPath,
      comments:
        "The path or the file id to the folder to share. If it does not exist, then a new one is created.",
      example: "/example/workspace",
    },
    acl_update_policy,
    force_async,
    member_policy,
    shared_link_policy,
    viewer_info_policy,
    access_inheritance,
    actions,
    userType,
    teamMemberId,
    debug,
  },
  examplePayload: {
    data: shareFolderPayload,
  },
});
