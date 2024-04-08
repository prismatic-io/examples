import { input, util } from "@prismatic-io/spectral";
import { cleanActionArray, cleanString, cleanStringWithTag } from "./util";
import { ALL_LEVELS_AUTHENTICATION_INPUT_MODEL } from "./constants";

export const userType = input({
  label: "Team User Type",
  comments: "The type of user to connect with. Admin or User",
  type: "string",
  required: false,
  model: ALL_LEVELS_AUTHENTICATION_INPUT_MODEL,
  clean: (value) => (value !== "" ? (value as "admin" | "user") : undefined),
});
export const teamMemberId = input({
  label: "Team Member ID",
  comments: "The ID of the team member. Required if Team User Type is set",
  type: "string",
  required: false,
  clean: (value) => (value !== "" ? util.types.toString(value) : undefined),
  example: "dbmid:abcd1234",
});
export const path = input({
  label: "Path",
  placeholder: "File Path",
  type: "string",
  required: true,
  comments:
    "The location of a file within a Dropbox share. Include a leading /.",
  example: "/path/to/file.txt",
  clean: util.types.toString,
});

export const directoryPath = input({
  label: "Directory Path",
  placeholder: "Directory Path Prefix",
  type: "string",
  required: false,
  comments:
    "The path to a directory within a Dropbox share. Include a leading /.",
  example: "/path/to/my/directory/",
  clean: cleanString,
});

export const fileName = input({
  label: "File Name",
  placeholder: "File Name",
  type: "string",
  required: false,
  comments: "The name of a file within a Dropbox share.",
  example: "fileName.txt",
  clean: cleanString,
});

export const fromPath = input({
  label: "From Path",
  placeholder: "From Path",
  type: "string",
  required: true,
  comments:
    "The location of a source file within a Dropbox share. Include a leading /.",
  example: "/path/to/source/file.txt",
  clean: util.types.toString,
});

export const toPath = input({
  label: "To Path",
  placeholder: "To Path",
  type: "string",
  required: true,
  comments:
    "The location of a destination file within a Dropbox share. Include a leading /.",
  example: "/path/to/destination/file.txt",
  clean: util.types.toString,
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
  clean: util.types.toData,
});

export const limit = input({
  label: "Limit",
  type: "string",
  required: false,
  comments:
    "The maximum number of results to return per request. Note: This is an approximate number and there can be slightly more entries returned in some cases.",
  example: `25`,
  clean: (value: unknown) => util.types.toInt(value, 25),
});

export const cursor = input({
  label: "Cursor",
  type: "string",
  required: false,
  comments:
    "Specify the cursor returned by your last call to list_folder or list_folder/continue.",
  example: `lslTXFcbLQKkb0vP9Kgh5hy0Y0OnC7Z9ZPHPwPmMnxSk3eiDRMkct7D8E`,
  clean: util.types.toString,
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
  comments:
    "This represents the source files's path. Include a leading / (Use this, Dynamic Paths or both)",
  example: "/path/to/source/file.txt",
  required: false,
  clean: (stringArray: any) =>
    stringArray.map((string: string) => util.types.toString(string)),
});

export const urlToSave = input({
  label: "URL to Save",
  placeholder: "URL to Save",
  type: "string",
  required: true,
  comments: "The URL to save to Dropbox",
  example: "https://example.com/file.txt",
  clean: util.types.toString,
});

export const waitUntilComplete = input({
  label: "Wait Until Complete",
  type: "boolean",
  required: false,
  default: "false",
  comments: "Whether to wait for the operation to complete.",
  clean: util.types.toBool,
});

export const asyncJobId = input({
  label: "Async Job ID",
  placeholder: "Async Job ID",
  type: "string",
  required: true,
  comments:
    "The ID of the asynchronous job. From the response of the Save From URL action would be a good place to get this value.",
  example: "nMvNReawvD4AAAAAAAAAAQ",
  clean: util.types.toString,
});

export const recursive = input({
  label: "Recursive",
  comments: "If true, the response will contain contents of all subfolders.",
  type: "boolean",
  default: "false",
  required: true,
  clean: util.types.toBool,
});

export const includeDeleted = input({
  label: "Include Deleted?",
  comments:
    "If true, the results will include entries for files and folders that used to exist but were deleted.",
  type: "boolean",
  default: "false",
  required: true,
  clean: util.types.toBool,
});

export const dynamicPaths = input({
  label: "Dynamic Paths",
  type: "data",
  required: false,
  comments: "An optional list of paths (Use this, File Paths or both)",
  example: `["/path/to/file", "/path/to/another/file"]`,
});

export const lookupKey = input({
  label: "Lookup By",
  type: "string",
  required: true,
  model: [
    { label: "Email", value: "email" },
    { label: "Team Member Id", value: "team_member_id" },
    { label: "External ID", value: "external_id" },
  ],
  clean: util.types.toString,
});

export const audience = input({
  label: "Audience",
  type: "string",
  required: true,
  model: [
    { label: "Public", value: "public" },
    { label: "Team", value: "team" },
    { label: "No One", value: "no_one" },
    { label: "Empty", value: "" },
  ],
  clean: cleanStringWithTag,
  default: "",
});

export const lookupValue = input({
  label: "Value",
  type: "string",
  required: true,
  clean: util.types.toString,
});

export const link_password = input({
  label: "Link Password",
  type: "string",
  required: false,
  comments: "If the shared link has a password, this parameter can be used.",
  example: "anExamplePassword",
  clean: util.types.toString,
});

export const expires = input({
  label: "Expires",
  type: "string",
  required: false,
  comments:
    "Expiration time of the shared link. By default the link won't expire.",
  example: "2021-01-01T00:00:00Z",
  clean: util.types.toString,
});

export const require_password = input({
  label: "Require Password",
  type: "boolean",
  required: false,
  comments: "Boolean flag to enable or disable password protection.",
  clean: util.types.toBool,
  default: "false",
});

export const direct_only = input({
  label: "Direct Only",
  type: "boolean",
  required: false,
  comments:
    "Links to parent folders can be suppressed by setting direct_only to true.",
  clean: util.types.toBool,
  default: "false",
});

export const force_async = input({
  label: "Force Async",
  type: "boolean",
  required: false,
  comments: "Whether to force the share to happen asynchronously. ",
  clean: util.types.toBool,
  default: "false",
});

export const acl_update_policy = input({
  label: "ACL Update Policy",
  type: "string",
  required: false,
  comments: "Who can add and remove members of this shared folder.",
  clean: cleanStringWithTag,
  model: [
    { label: "Owner", value: "owner" },
    { label: "Editors", value: "editors" },
    { label: "Empty", value: "" },
  ],
  default: "",
});

export const member_policy = input({
  label: "Member Policy",
  type: "string",
  required: false,
  comments:
    "Who can be a member of this shared folder. Only applicable if the current user is on a team.",
  clean: cleanStringWithTag,
  model: [
    { label: "team", value: "team" },
    { label: "anyone", value: "anyone" },
    { label: "team_and_approved", value: "team_and_approved" },
    { label: "Empty", value: "" },
  ],
  default: "",
});

export const shared_link_policy = input({
  label: "Shared Link Policy",
  type: "string",
  required: false,
  comments:
    "The policy to apply to shared links created for content inside this shared folder. The current user must be on a team to set this policy to SharedLinkPolicy.members.",
  clean: cleanStringWithTag,
  model: [
    { label: "team", value: "team" },
    { label: "anyone", value: "anyone" },
    { label: "members", value: "members" },
    { label: "Empty", value: "" },
  ],
  default: "",
});

export const viewer_info_policy = input({
  label: "Viewer Info Policy",
  type: "string",
  required: false,
  comments: "Who can enable/disable viewer info for this shared folder.",
  clean: cleanStringWithTag,
  model: [
    { label: "enabled", value: "enabled" },
    { label: "disabled", value: "disabled" },
    { label: "Empty", value: "" },
  ],
  default: "",
});

export const access_inheritance = input({
  label: "Access Inheritance",
  type: "string",
  required: false,
  comments: "The access inheritance settings for the folder. ",
  clean: cleanStringWithTag,
  model: [
    { label: "inherit", value: "inherit" },
    { label: "no_inherit", value: "no_inherit" },
    { label: "Empty", value: "" },
  ],
  default: "",
});

export const actions = input({
  label: "Actions",
  type: "string",
  collection: "valuelist",
  required: false,
  comments:
    "A list of `FolderAction`s corresponding to `FolderPermission`s that should appear in the response's SharedFolderMetadata.permissions field describing the actions the authenticated user can perform on the folder.",
  clean: cleanActionArray,
  model: [
    {
      label: "change_options",
      value: "change_options",
    },
    {
      label: "disable_viewer_info",
      value: "disable_viewer_info",
    },
    {
      label: "edit_contents",
      value: "edit_contents",
    },
    {
      label: "enable_viewer_info",
      value: "enable_viewer_info",
    },
    {
      label: "invite_editor",
      value: "invite_editor",
    },
    {
      label: "invite_viewer",
      value: "invite_viewer",
    },
    {
      label: "invite_viewer_no_comment",
      value: "invite_viewer_no_comment",
    },
    {
      label: "relinquish_membership",
      value: "relinquish_membership",
    },
    { label: "unmount", value: "unmount" },
    { label: "unshare", value: "unshare" },
    { label: "leave_a_copy", value: "leave_a_copy" },
    {
      label: "share_linkdeprecated",
      value: "share_linkdeprecated",
    },
    {
      label: "create_linkdeprecated",
      value: "create_linkdeprecated",
    },
    {
      label: "create_view_link",
      value: "create_view_link",
    },
    {
      label: "create_edit_link",
      value: "create_edit_link",
    },
    {
      label: "set_access_inheritance",
      value: "set_access_inheritance",
    },
    { label: "Empty", value: "" },
  ],
  default: "",
});

export const link_settings = input({
  label: "Link Settings",
  type: "string",
  required: false,
  comments: "Settings on the link for this folder.",
  clean: cleanStringWithTag,
  model: [
    { label: "access_level", value: "access_level" },
    { label: "no_inherit", value: "no_inherit" },
    { label: "Empty", value: "" },
  ],
  default: "",
});

export const access = input({
  label: "Access",
  type: "string",
  required: false,
  comments:
    "Requested access level you want the audience to gain from this link. Note, modifying access level for an existing link is not supported.",
  clean: cleanStringWithTag,
  model: [
    { label: "Viewer", value: "viewer" },
    { label: "Editor", value: "editor" },
    { label: "Max", value: "editor" },
    { label: "Default", value: "default" },
    { label: "Empty", value: "" },
  ],
  default: "",
});

export const shared_folder_id = input({
  label: "Shared Folder ID",
  type: "string",
  required: true,
  comments: "The ID for the shared folder.",
  example: "84528192421",
  clean: util.types.toString,
});

export const leave_a_copy = input({
  label: "Leave a Copy",
  type: "boolean",
  required: false,
  comments:
    "If true, members of this shared folder will get a copy of this folder after it's unshared. Otherwise, it will be removed from their Dropbox. The current user, who is an owner, will always retain their copy.",
  clean: util.types.toBool,
  default: "false",
});

export const allow_download = input({
  label: "Allow Download",
  type: "boolean",
  required: false,
  comments:
    "Boolean flag to allow or not download capabilities for shared links.",
  clean: util.types.toBool,
  default: "false",
});

export const fileId = input({
  label: "File Id",
  type: "string",
  required: true,
  comments: "The ID for the shared file.",
  example: "id:3kmLmQFnf1AAAAAAAAAAAw",
  clean: util.types.toString,
});

export const include_media_info = input({
  label: "Include Media Info",
  type: "boolean",
  required: false,
  comments: "If true, FileMetadata.media_info is set for photo and video.",
  clean: util.types.toBool,
  default: "false",
});

export const include_deleted = input({
  label: "Include Deleted",
  type: "boolean",
  required: false,
  comments:
    "DeletedMetadata will be returned for deleted file or folder, otherwise LookupError.not_found will be returned.",
  clean: util.types.toBool,
  default: "false",
});

export const include_has_explicit_shared_members = input({
  label: "Include Has Explicit Shared Members",
  type: "boolean",
  required: false,
  comments:
    "If true, the results will include a flag for each file indicating whether or not that file has any explicit members.",
  clean: util.types.toBool,
  default: "false",
});

export const include_property_groups = input({
  label: "Include Property Groups",
  type: "string",
  required: false,
  comments:
    "If set to a valid list of template IDs, FileMetadata.property_groups is set if there exists property data associated with the file and each of the listed templates.",
  clean: cleanStringWithTag,
  model: [
    { label: "filter_some", value: "filter_some" },
    { label: "Empty", value: "" },
  ],
  default: "",
});

export const download_as_zip = input({
  label: "Download as Zip",
  type: "boolean",
  required: false,
  comments:
    "Download a folder from the user's Dropbox, as a zip file. The folder must be less than 20 GB in size and any single file within must be less than 4 GB in size.",
  clean: util.types.toBool,
  default: "false",
});

export const debug = input({
  label: "Debug",
  type: "boolean",
  required: false,
  comments:
    "Whether to log the payload to the debug log. This is useful for troubleshooting.",
  clean: util.types.toBool,
  default: "false",
});
