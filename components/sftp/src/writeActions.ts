import { action, util, input } from "@prismatic-io/spectral";
import { connection, debugInput } from "./inputs";
import { getSftpClient } from "./client";

const outputPath = input({
  label: "Path",
  placeholder: "Path on SFTP server to write file",
  type: "string",
  required: true,
  comments: "Path on SFTP server to write file",
  example: "/we/love/commas.csv",
  clean: util.types.toString,
});

const data = input({
  label: "Data",
  placeholder: "Data to write",
  type: "text",
  required: true,
  comments: "Text to write into the file",
  // We might get a file (isData), a string, or a JavaScript object, and we need a Buffer
  //  File - just pass in the data, which is already a Buffer
  //  String - convert to a Buffer and pass it in
  //  JavaScript Object - JSON.stringify it and then convert to a Buffer
  clean: (value) =>
    util.types.isData(value)
      ? util.types.toData(value).data
      : Buffer.from(typeof value === "string" ? value : JSON.stringify(value)),
});

const writeFile = action({
  display: {
    label: "Write File",
    description: "Write a file to SFTP",
  },
  perform: async (context, { connection, data, outputPath, debug }) => {
    const sftp = await getSftpClient(connection, debug);
    try {
      const result = await sftp.put(data, outputPath);
      return { data: result };
    } finally {
      await sftp.end();
    }
  },
  inputs: { connection, outputPath, data, debug: debugInput },
  examplePayload: {
    data: "Uploaded data stream to /upload/path/to/file.txt",
  },
});

export default writeFile;
