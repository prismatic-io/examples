import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  filePaths,
  connectionInput,
  teamMemberId,
  dynamicPaths,
  debug,
} from "../inputs";
import { checkDebug, getEntries, handleDropboxError } from "../util";
import { MISSING_PATHS_ERROR_MESSAGE } from "../constants";
import { getFileLockPayload } from "../example-payloads";

export const getFileLock = action({
  display: {
    label: "Get File Lock",
    description: "Return the lock metadata for the given list of paths",
  },
  perform: async (
    context,
    { filePaths, dropboxConnection, teamMemberId, dynamicPaths, debug }
  ) => {
    checkDebug(
      {
        filePaths,
        dropboxConnection,
        teamMemberId,
        dynamicPaths,
        debug,
      },
      context
    );
    if (!filePaths && !dynamicPaths) {
      throw new Error(MISSING_PATHS_ERROR_MESSAGE);
    }
    const dbx = createAuthorizedClient(
      dropboxConnection,
      teamMemberId ? "user" : undefined,
      teamMemberId
    );

    const entries = getEntries(filePaths, dynamicPaths);

    try {
      const args = {
        entries,
      };
      const result = await dbx.filesGetFileLockBatch(args);
      return {
        data: result,
      };
    } catch (err) {
      handleDropboxError(err, entries);
    }
  },
  inputs: {
    dropboxConnection: connectionInput,
    teamMemberId: {
      ...teamMemberId,
      comments: "Used to specify the user to act on behalf of.",
    },
    filePaths,
    dynamicPaths,
    debug,
  },
  examplePayload: {
    data: getFileLockPayload,
  },
});
