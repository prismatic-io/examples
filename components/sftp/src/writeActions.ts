import { action } from "@prismatic-io/spectral";
import { connection, data, outputPath } from "./inputs";
import { getSftpClient } from "./client";

const writeFile = action({
  display: {
    label: "Write File",
    description: "Write a file to SFTP",
  },
  perform: async (context, { connection, data, outputPath }) => {
    const sftp = await getSftpClient(connection, context.debug.enabled);
    try {
      const result = await sftp.put(data, outputPath);
      return { data: result };
    } finally {
      await sftp.end();
    }
  },
  inputs: { connection, outputPath, data },
  examplePayload: {
    data: "Uploaded data stream to /upload/path/to/file.txt",
  },
});

export default writeFile;
