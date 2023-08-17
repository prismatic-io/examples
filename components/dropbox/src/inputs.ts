import { input, util } from "@prismatic-io/spectral";
export const userType = input({
  label: "Team User Type",
  comments: "The type of user to connect with. Admin or User",
  type: "string",
  required: false,
  model: [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
    { label: "", value: "" },
  ],
  clean: (value) => (value !== "" ? (value as "admin" | "user") : undefined),
});
export const teamMemberId = input({
  label: "Team Member ID",
  comments: "The ID of the team member. Required if Team User Type is set",
  type: "string",
  required: false,
  clean: (value) => (value !== "" ? util.types.toString(value) : undefined),
});
export const path = input({
  label: "Path",
  placeholder: "File Path",
  type: "string",
  required: true,
  comments:
    "The location of a file within a Dropbox share. Include a leading /.",
  example: "/path/to/file.txt",
});

export const directoryPath = input({
  label: "Directory Path",
  placeholder: "Directory Path Prefix",
  type: "string",
  required: false,
  comments:
    "The path to a directory within a Dropbox share. Include a leading /.",
  example: "/path/to/my/directory/",
  clean: (value) => util.types.toString(value).replace(/\/$/, ""),
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

export const folderActions = input({
  label: "Folder Actions",
  placeholder: "Folder Action",
  collection: "keyvaluelist",
  type: "string",
  required: false,
  comments:
    "A list of `FolderAction`s corresponding to `FolderPermission`s that should appear in the response's SharedFolderMetadata.permissions field describing the actions the authenticated user can perform on the folder. This field is optional.",
  example: "disable_viewer_info",
  clean: (value) => {
    const folderActions = (value as []) || [];
    if (folderActions.length === 0) {
      return undefined;
    }
    return folderActions.map((value) => ({ ".tag": value }));
  },
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

export const filePaths = input({
  label: "File Path",
  placeholder: "File Path",
  type: "string",
  collection: "valuelist",
  comments: "This represents the source files's path. Include a leading /",
  example: "/path/to/source/file.txt",
  required: true,
  clean: (stringArray: any) =>
    stringArray.map((string: string) => util.types.toString(string)),
});
