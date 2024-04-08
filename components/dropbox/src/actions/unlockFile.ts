import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import {
  filePaths,
  connectionInput,
  teamMemberId,
  userType,
  dynamicPaths,
  debug,
} from "../inputs";
import { checkDebug, getEntries, handleDropboxError } from "../util";
import { MISSING_PATHS_ERROR_MESSAGE } from "../constants";
import { unlockFilePayload } from "../example-payloads";

export const unlockFile = action({
  display: {
    label: "Unlock File",
    description: "Unlock the files at the given paths",
  },
  perform: async (
    context,
    {
      filePaths,
      dropboxConnection,
      userType,
      teamMemberId,
      dynamicPaths,
      debug,
    }
  ) => {
    checkDebug(
      {
        filePaths,
        dropboxConnection,
        userType,
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
      userType,
      teamMemberId
    );

    const entries = getEntries(filePaths, dynamicPaths);

    try {
      const args = {
        entries,
      };
      const result = await dbx.filesUnlockFileBatch(args);
      return {
        data: result,
      };
    } catch (err) {
      handleDropboxError(err, entries);
    }
  },
  inputs: {
    dropboxConnection: connectionInput,
    userType,
    teamMemberId,
    filePaths,
    dynamicPaths,
    debug,
  },
  examplePayload: {
    data: unlockFilePayload,
  },
});
