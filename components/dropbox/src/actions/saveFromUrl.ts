import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  connectionInput,
  debug,
  toPath,
  urlToSave,
  waitUntilComplete,
} from "../inputs";
import { checkDebug, handleDropboxError, validatePath } from "../util";
import { delay } from "../helpers";
import { DropboxResponse, files } from "dropbox";
import { IN_PROGRESS_TAG } from "../constants";
import { saveFromUrlPayload } from "../example-payloads";

export const saveFromUrl = action({
  display: {
    label: "Save From URL",
    description: "Save a file from a URL to Dropbox",
  },
  perform: async (
    context,
    { dropboxConnection, toPath, urlToSave, waitUntilComplete, debug }
  ) => {
    checkDebug(
      { dropboxConnection, toPath, urlToSave, waitUntilComplete, debug },
      context
    );
    validatePath(toPath);
    const dbx = createAuthorizedClient(dropboxConnection);

    try {
      const filesSaveUrl = await dbx.filesSaveUrl({
        path: toPath,
        url: urlToSave,
      });

      if (waitUntilComplete) {
        const asyncJobId = filesSaveUrl.result["async_job_id"];
        let filesSaveUrlCheckJobStatus: DropboxResponse<files.SaveUrlJobStatus>;

        do {
          filesSaveUrlCheckJobStatus = await dbx.filesSaveUrlCheckJobStatus({
            async_job_id: asyncJobId,
          });
          // Wait for 1 second before checking the status again
          await delay(1000);
        } while (filesSaveUrlCheckJobStatus.result[".tag"] === IN_PROGRESS_TAG);
        return { data: filesSaveUrlCheckJobStatus };
      }

      return { data: filesSaveUrl };
    } catch (err) {
      handleDropboxError(err, [toPath]);
    }
  },
  inputs: {
    dropboxConnection: connectionInput,
    toPath: {
      ...toPath,
      comments:
        "The path with file name with extension where the URL will be saved to in Dropbox.",
      example: "/path/to/file.txt",
    },
    urlToSave,
    waitUntilComplete,
    debug,
  },
  examplePayload: {
    data: saveFromUrlPayload,
  },
});
