import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  teamMemberId,
  userType,
  shared_folder_id,
  path,
  require_password,
  link_password,
  expires,
  audience,
  access,
  allow_download,
  debug,
} from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { createSharedLinkPayload } from "../example-payloads";

export const createSharedLink = action({
  display: {
    label: "Create Shared Link",
    description:
      "Create a shared link with custom settings. If no settings are given then the default visibility is RequestedVisibility.public (The resolved visibility, though, may depend on other aspects such as team and shared folder settings).",
  },
  perform: async (
    context,
    {
      dropboxConnection,
      teamMemberId,
      userType,
      path,
      access,
      allow_download,
      audience,
      expires,
      link_password,
      require_password,
      debug,
    }
  ) => {
    checkDebug(
      {
        dropboxConnection,
        teamMemberId,
        userType,
        path,
        access,
        allow_download,
        audience,
        expires,
        link_password,
        require_password,
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
      const result = await dbx.sharingCreateSharedLinkWithSettings({
        path,
        settings: {
          access: (access as any) || undefined,
          allow_download: allow_download || undefined,
          audience: (audience as any) || undefined,
          expires: expires || undefined,
          link_password: link_password || undefined,
          require_password: require_password || undefined,
        },
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
    path,
    require_password,
    link_password,
    expires,
    audience,
    access,
    allow_download,
    userType,
    teamMemberId,
    debug,
  },
  examplePayload: {
    data: createSharedLinkPayload,
  },
});
