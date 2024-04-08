import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput, asyncJobId, debug } from "../inputs";
import { checkDebug, handleDropboxError } from "../util";
import { getDownloadStatusPayload } from "../example-payloads";

export const getDownloadStatus = action({
  display: {
    label: "Get Download Status",
    description: "Get the status of a file download from a URL to Dropbox",
  },
  perform: async (context, { dropboxConnection, asyncJobId, debug }) => {
    checkDebug({ dropboxConnection, asyncJobId, debug }, context);
    const dbx = createAuthorizedClient(dropboxConnection);

    try {
      const filesSaveUrlCheckJobStatus = await dbx.filesSaveUrlCheckJobStatus({
        async_job_id: asyncJobId,
      });
      return { data: filesSaveUrlCheckJobStatus };
    } catch (err) {
      handleDropboxError(err);
    }
  },
  inputs: {
    dropboxConnection: connectionInput,
    asyncJobId,
    debug,
  },
  examplePayload: {
    data: getDownloadStatusPayload,
  },
});
