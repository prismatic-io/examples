import { action, util, input } from "@prismatic-io/spectral";
import { connection, debugInput } from "./inputs";
import { getSftpClient } from "./client";

const sourcePath = input({
  label: "Source Path",
  placeholder: "Path of file to move",
  type: "string",
  required: true,
  comments: "Path of file to move",
  example: "/my/starting/path.txt",
  clean: util.types.toString,
});

const destinationPath = input({
  label: "Destination Path",
  placeholder: "Path to move the file to",
  type: "string",
  required: true,
  comments: "Path of file to move",
  example: "/my/destination/path.txt",
  clean: util.types.toString,
});

const moveFile = action({
  display: {
    label: "Move File",
    description: "Move a file on an SFTP server",
  },
  perform: async (
    context,
    { connection, sourcePath, destinationPath, debug }
  ) => {
    const sftp = await getSftpClient(connection, debug);

    try {
      await sftp.rename(sourcePath, destinationPath);
    } finally {
      await sftp.end();
    }

    return null;
  },
  inputs: { connection, sourcePath, destinationPath, debug: debugInput },
});

export default moveFile;
