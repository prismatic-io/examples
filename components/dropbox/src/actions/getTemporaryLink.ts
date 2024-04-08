import { action } from "@prismatic-io/spectral";
import { files } from "dropbox";
import { createAuthorizedClient } from "../auth";
import { connectionInput, debug, path, teamMemberId } from "../inputs";
import { checkDebug, handleDropboxError, validatePath } from "../util";
import { getTemporaryLinkPayload } from "../example-payloads";

export const getTemporaryLink = action({
  display: {
    label: "Get Temporary Link",
    description: "Get a temporary link to stream content of a file.",
  },
  perform: async (
    context,
    { dropboxConnection, path, debug, teamMemberId }
  ) => {
    checkDebug(
      {
        dropboxConnection,
        path,
        teamMemberId,
        debug,
      },
      context
    );

    const dbx = createAuthorizedClient(
      dropboxConnection,
      teamMemberId ? "user" : undefined,
      teamMemberId
    );
    validatePath(path);
    try {
      const getTemporaryLinkArg: files.GetTemporaryLinkArg = {
        path,
      };
      const result = await dbx.filesGetTemporaryLink(getTemporaryLinkArg);
      return {
        data: result,
      };
    } catch (err) {
      handleDropboxError(err, [path]);
    }
  },
  inputs: {
    dropboxConnection: connectionInput,
    path: {
      ...path,
      comments: "The path to the file you want a temporary link to",
      placeholder: "/video.mp4",
      example: "/video.mp4",
    },
    teamMemberId: {
      ...teamMemberId,
      comments: "Used to specify the user to act on behalf of.",
    },
    debug,
  },
  examplePayload: { data: getTemporaryLinkPayload },
});
