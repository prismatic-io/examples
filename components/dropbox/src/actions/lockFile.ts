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
import { lockFileBatchPayload } from "../example-payloads";
import { MISSING_PATHS_ERROR_MESSAGE } from "../constants";

export const lockFile = action({
  display: {
    label: "Lock File",
    description: "Lock the files at the given paths",
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
      const result = await dbx.filesLockFileBatch(args);
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
    data: lockFileBatchPayload,
  },
});
