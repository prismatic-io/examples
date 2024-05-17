import { action, util, input } from "@prismatic-io/spectral";
import { connection, debugInput } from "./inputs";
import { getSftpClient } from "./client";

const path = input({
  label: "Path",
  placeholder: "Path of file to delete",
  type: "string",
  required: true,
  comments: "Path of file to delete",
  example: "/path/to/file.txt",
  clean: util.types.toString,
});

const deleteFile = action({
  display: {
    label: "Delete File",
    description: "Delete a file from a SFTP server",
  },
  perform: async (context, { connection, path, debug }) => {
    const sftp = await getSftpClient(connection, debug);
    try {
      await sftp.delete(path);
    } finally {
      await sftp.end();
    }

    return null;
  },
  inputs: { connection, path, debug: debugInput },
});

export default deleteFile;
