import { input, util } from "@prismatic-io/spectral";

export const connection = input({
  label: "Connection",
  type: "connection",
  required: true,
});

export const debugInput = input({
  label: "Show Debug Output",
  comments:
    "Show additional debug output in logs. Note: SFTP is very verbose - expect hundreds of debug lines when this is enabled.",
  type: "boolean",
  required: true,
  default: "false",
  clean: util.types.toBool,
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
