import { action } from "@prismatic-io/spectral";
import { getSftpClient } from "./client";
import { connection, path, recursive } from "./inputs";

const createDirectory = action({
  display: {
    label: "Create Directory",
    description:
      "Create a new directory. If the recursive flag is set to true, the method will create any directories in the path which do not already exist.",
  },
  perform: async (context, { connection, path, recursive }) => {
    const sftp = await getSftpClient(connection, context.debug.enabled);

    try {
      const newDirectory = await sftp.mkdir(path, recursive);
      return {
        data: newDirectory,
      };
    } finally {
      await sftp.end();
    }
  },
  inputs: { connection, path, recursive },
  examplePayload: {
    data: "/path/to/new/directory/",
  },
});

export default {
  createDirectory,
};
