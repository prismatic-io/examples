import { action, input, util } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput, path, debug } from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { getTemporaryUploadLinkPayload } from "../example-payloads";

export const getTemporaryUploadLink = action({
  display: {
    label: "Get Temporary Upload Link",
    description: "Get a temporary presigned link to upload a file",
  },
  perform: async (context, params) => {
    checkDebug(params, context);
    const dbx = createAuthorizedClient(params.dropboxConnection);
    try {
      return {
        data: await dbx.filesGetTemporaryUploadLink({
          duration: params.duration,
          commit_info: { path: params.path, mode: { ".tag": "overwrite" } },
        }),
      };
    } catch (err) {
      handleDropboxError(err);
    }
  },
  inputs: {
    dropboxConnection: connectionInput,
    path,
    duration: input({
      label: "Duration",
      type: "string",
      comments:
        "How long the link will be valid, in seconds. Defaults to 1 hour.",
      default: "3600",
      clean: (value) => util.types.toNumber(value, 3600),
    }),
    debug,
  },
  examplePayload: {
    data: getTemporaryUploadLinkPayload,
  },
});
