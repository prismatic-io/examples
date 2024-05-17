import { action, util, input } from "@prismatic-io/spectral";
import { minimatch } from "minimatch";
import { connection, debugInput, path } from "./inputs";
import { getSftpClient } from "./client";

const pattern = input({
  label: "Pattern",
  default: "*",
  placeholder: "Glob-style string for listing specific files",
  type: "string",
  required: false,
  comments: "Glob-style string for listing specific files",
  example: "*.txt",
  clean: util.types.toString,
});

const listDirectory = action({
  display: {
    label: "List Directory",
    description: "List files in a directory on an SFTP server",
  },
  perform: async (context, { connection, path, pattern, debug }) => {
    const sftp = await getSftpClient(connection, debug);

    try {
      const fileList = await sftp.list(path, (file) =>
        pattern ? minimatch(file.name, pattern) : true
      );
      const fileNameList = fileList
        .filter(({ type }) => type !== "d")
        .map(({ name }) => name)
        .sort();
      return {
        data: fileNameList,
      };
    } finally {
      await sftp.end();
    }
  },
  inputs: { connection, path, pattern, debug: debugInput },
  examplePayload: {
    data: ["file.txt", "example.txt"],
  },
});

export default listDirectory;
