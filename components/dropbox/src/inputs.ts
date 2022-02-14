import { input } from "@prismatic-io/spectral";

export const path = input({
  label: "Path",
  placeholder: "File Path",
  type: "string",
  required: true,
  comments:
    "The location of a file within a Dropbox share. Include a leading /.",
  example: "/path/to/file.txt",
});

export const fromPath = input({
  label: "From Path",
  placeholder: "From Path",
  type: "string",
  required: true,
  comments:
    "The location of a source file within a Dropbox share. Include a leading /.",
  example: "/path/to/source/file.txt",
});

export const toPath = input({
  label: "To Path",
  placeholder: "To Path",
  type: "string",
  required: true,
  comments:
    "The location of a destination file within a Dropbox share. Include a leading /.",
  example: "/path/to/destination/file.txt",
});

export const fileContents = input({
  label: "File Contents",
  placeholder: "Output data from previous step",
  type: "data",
  required: true,
  comments:
    "The contents to write to a file. This can be a string of text, it can be binary data (like an image or PDF) that was generated in a previous step.",
  example: "My File Contents",
});

export const limit = input({
  label: "Limit",
  type: "string",
  required: false,
  comments:
    "The maximum number of results to return per request. Note: This is an approximate number and there can be slightly more entries returned in some cases.",
  example: `25`,
});

export const cursor = input({
  label: "Cursor",
  type: "string",
  required: false,
  comments:
    "Specify the cursor returned by your last call to list_folder or list_folder/continue.",
  example: `lslTXFcbLQKkb0vP9Kgh5hy0Y0OnC7Z9ZPHPwPmMnxSk3eiDRMkct7D8E`,
});

export const connectionInput = input({
  label: "Connection",
  type: "connection",
  required: true,
});
