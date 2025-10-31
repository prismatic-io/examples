import { action } from "@prismatic-io/spectral";
import { connection, outputPathAppend, dataAppend } from "./inputs";
import { getSftpClient } from "./client";

const appendFile = action({
  display: {
    label: "Append File",
    description: "Append data to an existing file on a SFTP server.",
  },
  perform: async (context, { connection, data, outputPath }) => {
    const sftp = await getSftpClient(connection, context.debug.enabled);
    try {
      await sftp.append(data, outputPath);
      return { data: `Appended data to ${outputPath}` };
    } finally {
      await sftp.end();
    }
  },
  inputs: {
    connection,
    outputPath: outputPathAppend,
    data: dataAppend,
  },
  examplePayload: {
    data: "Appended data to /upload/path/to/file.txt",
  },
});

export default { appendFile };
