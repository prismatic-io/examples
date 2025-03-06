import { basename } from "path";
import * as mime from "mime-types";
import { action, util, input } from "@prismatic-io/spectral";
import { connection, debugInput, returnBuffer } from "./inputs";
import { getSftpClient } from "./client";
import { promises } from "fs";

const inputPath = input({
  label: "Path",
  placeholder: "Path on SFTP server to read data from",
  type: "string",
  required: true,
  comments: "Path of file on SFTP server to read data from",
  example: "/path/to/file.txt",
  clean: util.types.toString,
});

const readFile = action({
  display: {
    label: "Read File",
    description: "Read a file from SFTP",
  },
  perform: async (context, { connection, inputPath, debug, returnBuffer }) => {
    const sftp = await getSftpClient(connection, debug);

    try {
      const inputData = await sftp.get(inputPath);
      return {
        data: inputData,
        contentType: returnBuffer
          ? mime.types.bin
          : mime.lookup(basename(inputPath)) || mime.types.bin,
      };
    } finally {
      await sftp.end();
    }
  },
  inputs: {
    connection,
    inputPath,
    returnBuffer,
    debug: debugInput,
  },
  examplePayload: {
    data: "Sample file contents",
    contentType: "text/plain",
  },
});

const fastGet = action({
  display: {
    label: "Fast Get",
    description: "Read a file from SFTP",
  },
  perform: async (context, { connection, inputPath, debug }) => {
    const sftp = await getSftpClient(connection, debug);

    try {
      const fileName = basename(inputPath);
      const localPath = `/tmp/${fileName}`;
      await sftp.fastGet(inputPath, localPath);

      return {
        data: await promises.readFile(localPath),
        contentType: returnBuffer
          ? mime.types.bin
          : mime.lookup(fileName) || mime.types.bin,
      };
    } finally {
      await sftp.end();
    }
  },
  inputs: {
    connection,
    inputPath,
    returnBuffer,
    debug: debugInput,
  },
  examplePayload: {
    data: Buffer.from("Sample file contents"),
    contentType: "text/plain",
  },
});

const statFile = action({
  display: {
    label: "Stat File",
    description: "Pull statistics about a file",
  },
  perform: async (context, { connection, inputPath, debug }) => {
    const sftp = await getSftpClient(connection, debug);

    try {
      const statData = await sftp.stat(inputPath);
      return {
        data: statData,
      };
    } finally {
      await sftp.end();
    }
  },
  inputs: { connection, inputPath, debug: debugInput },
  examplePayload: {
    data: {
      mode: 33279, // integer representing type and permissions
      uid: 1000, // user ID
      gid: 985, // group ID
      size: 5, // file size
      accessTime: 1566868566000, // Last access time. milliseconds
      modifyTime: 1566868566000, // last modify time. milliseconds
      isDirectory: false, // true if object is a directory
      isFile: true, // true if object is a file
      isBlockDevice: false, // true if object is a block device
      isCharacterDevice: false, // true if object is a character device
      isSymbolicLink: false, // true if object is a symbolic link
      isFIFO: false, // true if object is a FIFO
      isSocket: false, // true if object is a socket
    },
  },
});

export default { readFile, statFile, fastGet };
