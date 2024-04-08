import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  debug,
  directoryPath,
  link_password,
  teamMemberId,
  urlToSave,
  userType,
} from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { getSharedLinkFilePayload } from "../example-payloads";

export const getSharedLinkFile = action({
  display: {
    label: "Get Shared Link File",
    description: "Download the shared link's file from a user's Dropbox.",
  },
  perform: async (context, params) => {
    checkDebug(params, context);
    const dbx = createAuthorizedClient(
      params.dropboxConnection,
      params.userType,
      params.teamMemberId
    );

    try {
      const data = await dbx.sharingGetSharedLinkFile({
        url: params.urlToSave,
        path: params.path || undefined,
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
    urlToSave: {
      ...urlToSave,
      label: "Shared Link URL",
      comments: "StringURL of the shared link.",
      required: true,
      example:
        "https://www.dropbox.com/s/2sn712vy1ovegw8/Prime_Numbers.txt?dl=0",
    },
    path: {
      ...directoryPath,
      required: false,
      comments:
        "If the shared link is to a folder, this parameter can be used to retrieve the metadata for a specific file or sub-folder in this folder. A relative path should be used.",
      example: "/Homework/math/Prime_Numbers.gsheet",
    },
    link_password,
    userType,
    teamMemberId,
    debug,
  },
  examplePayload: {
    data: getSharedLinkFilePayload,
  },
});
