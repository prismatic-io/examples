import { input, util } from "@prismatic-io/spectral";

export const connection = input({
  label: "Connection",
  type: "connection",
  required: true,
});

export const path = input({
  label: "Path",
  placeholder: "Path of directory on an SFTP server to list files of",
  type: "string",
  required: true,
  comments: "Path of directory on an SFTP server to list files of",
  example: "/path/to/directory/",
  clean: util.types.toString,
});

export const recursive = input({
  label: "Recursive",
  comments: "If true, create any missing directories in the path as well",
  type: "boolean",
  required: false,
  default: "true",
  clean: util.types.toBool,
});

export const returnBuffer = input({
  label: "Always Return Buffer",
  type: "boolean",
  required: true,
  default: "false",
  comments:
    "Always treat the file as a binary file with content type 'application/octet-stream', even if it is a text file. This is helpful if you are processing non-UTF-8 text files, as the runner assumes text files are UTF-8.",
  clean: util.types.toBool,
});

export const outputPath = input({
  label: "Path",
  placeholder: "Path on SFTP server to write file",
  type: "string",
  required: true,
  comments: "Path to file on SFTP server.",
  example: "/we/love/commas.csv",
  clean: util.types.toString,
});

export const outputPathAppend = input({
  ...outputPath,
  placeholder: "Append data to this path",
  comments: "Path on SFTP server to append file.",
  example: "/path/to/remote/file.txt",
});

export const data = input({
  label: "Data",
  placeholder: "Data to write",
  type: "text",
  required: true,
  comments: "Text to write into the file.",
  // We might get a file (isData), a string, or a JavaScript object, and we need a Buffer
  //  File - just pass in the data, which is already a Buffer
  //  String - convert to a Buffer and pass it in
  //  JavaScript Object - JSON.stringify it and then convert to a Buffer
  clean: (value) =>
    util.types.isData(value)
      ? util.types.toData(value).data
      : Buffer.from(typeof value === "string" ? value : JSON.stringify(value)),
});

export const dataAppend = input({
  ...data,
  placeholder: "Data to append",
  comments: "Text to append to the file.",
});

export const pattern = input({
  label: "Pattern",
  default: "*",
  placeholder: "Glob-style string for listing specific files",
  type: "string",
  required: false,
  comments: "Glob-style string for listing specific files",
  example: "*.txt",
  clean: util.types.toString,
});

export const includeSubdirectories = input({
  label: "Include Subdirectories",
  default: "false",
  type: "boolean",
  required: false,
  comments:
    "If true, will list files in all subdirectories. If false, only lists files in the specified directory.",
  example: "false",
  clean: util.types.toBool,
});

export const includeDirectories = input({
  label: "Include Directories",
  default: "false",
  type: "boolean",
  required: false,
  comments:
    "If true, will list directories in addition to files. If false, only lists files.",
  example: "false",
  clean: util.types.toBool,
});
