import { action, input } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { filePaths, connectionInput, teamMemberId, userType } from "../inputs";
import { handleDropboxError, validatePath } from "../util";

export const getFileLock = action({
  display: {
    label: "Get File Lock",
    description: "Return the lock metadata for the given list of paths",
  },
  perform: async (
    context,
    { filePaths, dropboxConnection, teamMemberId, userType, dynamicPaths }
  ) => {
    if (!filePaths && !dynamicPaths) {
      throw new Error("File Paths or Dynamic Paths must be specified");
    }
    const dbx = await createAuthorizedClient(
      dropboxConnection,
      userType,
      teamMemberId
    );
    try {
      const args = {
        entries: filePaths.map((path) => {
          validatePath(path);
          return { path };
        }),
      };
      if (dynamicPaths && Array.isArray(dynamicPaths)) {
        args.entries = args.entries.concat(
          dynamicPaths.map((path) => {
            validatePath(path);
            return { path };
          })
        );
      }
      const result = await dbx.filesGetFileLockBatch(args);
      return {
        data: result,
      };
    } catch (err) {
      handleDropboxError(err, filePaths);
    }
  },
  inputs: {
    dropboxConnection: connectionInput,
    teamMemberId,
    userType,
    filePaths: { ...filePaths, required: false },
    dynamicPaths: input({
      label: "Dynamic Paths",
      type: "data",
      required: false,
      comments: "An optional list of paths",
      example: `["/path/to/file", "/path/to/another/file"]`,
    }),
  },
});
