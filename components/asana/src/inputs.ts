import { input, util } from "@prismatic-io/spectral";
import { colorInputOptions } from "./util";

export const validateId = (value: unknown) => {
  const strValue = util.types.toString(value).trim();
  if (/[0-9]*/.test(strValue)) {
    return strValue;
  } else {
    throw new Error(
      `Asana global IDs are numbers. "${strValue}" is not a valid Asana global ID.`
    );
  }
};

export const workspaceId = input({
  label: "Workspace ID",
  type: "string",
  example: "375893453",
  comments: "The gid of the workspace",
  required: true,
  clean: validateId,
});

export const userId = input({
  label: "User ID",
  type: "string",
  example: "375893453",
  comments: "The global ID of a user",
  required: true,
  clean: validateId,
});

export const projectColor = input({
  label: "Project Color",
  type: "string",
  model: colorInputOptions,
  default: "light-green",
  comments: "The default color for your project",
  required: false,
  clean: (value) => util.types.toString(value) || undefined,
});

export const archived = input({
  label: "Archived",
  type: "boolean",
  comments:
    "True if the project is archived, false if not. Archived projects do not show in the UI by default and may be treated differently for queries.",
  required: false,
  clean: util.types.toBool,
});

export const statusId = input({
  label: "Status ID",
  type: "string",
  example: "375893453",
  comments: "The gid of the status update",
  required: true,
  clean: validateId,
});

export const statusParentIdInput = input({
  label: "Project, portfolio, or goal ID",
  comments: "The GID for a project, portfolio, or goal",
  type: "string",
  example: "375893453",
  required: true,
  clean: validateId,
});

export const defaultView = input({
  label: "Default View",
  type: "string",
  comments: "The default view of the project.",
  model: [
    { label: "List", value: "list" },
    { label: "Board", value: "board" },
    { label: "Calendar", value: "calendar" },
    { label: "Timeline", value: "timeline" },
  ],
  default: "list",
  required: true,
  clean: util.types.toString,
});

export const dueOn = input({
  label: "Due On",
  type: "string",
  comments:
    "The date in which the project is due. This field takes a date with YYYY-MM-DD format and should not be used together with due_at.",
  example: "2019-09-15",
  required: false,
  clean: (value) => (value ? util.types.toDate(value) : undefined),
});

export const followers = input({
  label: "Followers",
  type: "string",
  comments: "Provide a comma separated string of users.",
  example: "8570756435,375893453",
  required: false,
  clean: util.types.toString,
});

export const name = input({
  label: "Name",
  type: "string",
  comments:
    "Name of the project. This is generally a short sentence fragment that fits on a line in the UI for maximum readability.",
  example: "Example - Populate customers page with live data",
  required: false,
  clean: (value) => util.types.toString(value) || undefined,
});

export const notes = input({
  label: "Notes",
  type: "text",
  comments:
    "Free-form textual information associated with the object (ie., its description).",
  example: "These are some example notes.",
  required: false,
  clean: (value) => util.types.toString(value) || undefined,
});

export const isPublic = input({
  label: "Public",
  type: "boolean",
  comments: "True if the object is public to its team.",
  required: true,
  clean: util.types.toBool,
});

export const owner = input({
  label: "Owner ID",
  type: "string",
  comments: "Provide the unique identifier of the owner of the project.",
  example: "375893453",
  required: true,
  clean: validateId,
});

export const team = input({
  label: "Team ID",
  type: "string",
  comments:
    "The team that this project is shared with. This field only exists for projects in organizations. Including this field if you do not meet those conditions could cause your request to fail.",
  example: "375893453",
  required: false,
  clean: validateId,
});

export const startOn = input({
  label: "Start On",
  type: "string",
  comments:
    "The day on which work for this project begins, or null if the project has no start date. This takes a date with YYYY-MM-DD format",
  example: "2021-11-14",
  required: false,
  clean: (value) => (value ? util.types.toDate(value) : undefined),
});

export const author = input({
  label: "Author",
  type: "string",
  comments:
    "Provide a string value for the name of the author. You can also provide the unique identifier of a user who belongs to the same organization/workspace.",
  example: "John Doe",
  required: false,
  clean: (value) => util.types.toString(value) || undefined,
});

export const createdBy = input({
  label: "Created By",
  type: "string",
  comments:
    "This name represents an account in Asana that created the object. You can also provide a user Id or email.",
  example: "John Doe",
  required: false,
  clean: (value) => util.types.toString(value) || undefined,
});

export const statusUpdateColor = input({
  label: "Status Update Color",
  type: "string",
  comments: "The color associated with the status update.",
  model: colorInputOptions,
  default: "light-green",
  required: true,
  clean: util.types.toString,
});

export const projectId = input({
  label: "Project ID",
  type: "string",
  comments: "Provide the unique identifier of the project.",
  example: "375893453",
  required: true,
  clean: validateId,
});

export const taskId = input({
  label: "Task ID",
  type: "string",
  example: "375893453",
  comments: "Provide the unique identifier for the task.",
  required: true,
  clean: validateId,
});

export const teamDescription = input({
  label: "Description",
  type: "string",
  example: "This is an example description",
  comments: "Provide a string value for the description of the team.",
  required: false,
  clean: util.types.toString,
});

export const teamName = input({
  label: "Name",
  type: "string",
  example: "Engineering Team",
  comments: "Provide a string value for the name of the team.",
  required: true,
  clean: util.types.toString,
});

export const organizationId = input({
  label: "Organization or Workspace ID",
  type: "string",
  example: "375893453",
  comments: "Provide the unique identifier of the organization or workspace",
  required: true,
  clean: validateId,
});

export const teamId = input({
  label: "Team ID",
  type: "string",
  example: "843750385",
  comments: "Provide the unique identifier of the team.",
  required: true,
  clean: validateId,
});

export const approvalStatus = input({
  label: "Approval Status",
  type: "string",
  example: "Pending",
  model: [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Changes Requested", value: "changes_requested" },
  ],
  comments: "Provide a string value for the approval status of the task.",
  required: true,
  clean: (value) => util.types.toString(value) || undefined,
});

export const assigneeId = input({
  label: "Assignee ID",
  type: "string",
  example: "843750385",
  comments: "Provide the unique identifier of the assignee.",
  required: false,
  clean: (value) => validateId(value) || undefined,
});

export const assigneeSectionId = input({
  label: "Assignee Section ID",
  type: "string",
  example: "843750385",
  comments:
    "Provide the unique identifier of the section to assign the task to. The assignee section is a subdivision of a project that groups tasks together in the assignee's 'My Tasks' list.",
  required: false,
  clean: (value) => validateId(value) || undefined,
});

export const assigneeStatus = input({
  label: "Assignee Status",
  type: "string",
  example: "upcoming",
  comments:
    "Provide a string value representing the status the task has in relation to its assignee. This field is deprecated, you can still use it to form requests but it is not recommended for creating new records.",
  required: false,
  clean: (value) => util.types.toString(value) || undefined,
});

export const isCompleted = input({
  label: "Completed",
  type: "string",
  model: [
    { label: "True", value: "true" },
    { label: "False", value: "false" },
    { label: "Do not change", value: "" },
  ],
  default: "",
  comments:
    "True if the task is completed, false if not. Select 'Do not change' to avoid updating this value.",
  required: false,
  clean: (value) => (value === "" ? undefined : util.types.toBool(value)),
});

export const completedBy = input({
  label: "Completed By",
  type: "string",
  example: "John Doe",
  comments:
    "Provide a string value for the name of the user who completed the task. You can also provide a userId, or email.",
  required: false,
  clean: (value) => util.types.toString(value).trim() || undefined,
});

export const dueAt = input({
  label: "Due At",
  type: "string",
  example: "2019-09-15T02:06:58.147Z",
  comments:
    "Provide an ISO 8601 date string in UTC and should NOT be used together with Due On.",
  required: false,
  clean: (value) => (value ? util.types.toDate(value) : undefined),
});

export const projectList = input({
  label: "Project List",
  type: "string",
  example: "843750385",
  collection: "valuelist",
  comments: "For each item, provide the unique identifier of the project.",
  required: false,
});

export const parentId = input({
  label: "Parent ID",
  type: "string",
  example: "843750385",
  comments: "Provide the unique identifier of the parent element.",
  required: false,
  clean: (value) => validateId(value) || undefined,
});

export const isLiked = input({
  label: "Is Liked",
  type: "string",
  model: [
    { label: "True", value: "true" },
    { label: "False", value: "false" },
    { label: "Do not change", value: "" },
  ],
  default: "",
  required: false,
  comments:
    "This flag will mark the specified task as 'liked' in your Asana account.",
  clean: (value) => (value === "" ? undefined : util.types.toBool(value)),
});

export const followersList = input({
  label: "Followers List",
  type: "string",
  example: "843750385",
  collection: "valuelist",
  comments:
    "For each item, provide the unique identifier of an existing userId.",
  required: false,
});

export const resourceSubtype = input({
  label: "Resource Subtype",
  type: "string",
  example: "task",
  comments: "Provide a string value for the type of object.",
  required: false,
  clean: (value) => util.types.toString(value) || undefined,
});

export const limit = input({
  label: "Limit",
  type: "string",
  example: "20",
  comments:
    "The maximum number of items you would like returned (between 1 and 100)",
  required: false,
  clean: (value) => util.types.toInt(value) || undefined,
});

export const offset = input({
  label: "Offset",
  type: "string",
  example: "eyJ0eXAiOJiKV1iQLCJhbGciOiJIUzI1NiJ9",
  comments:
    "An offset token returned from a previous query that had a next_page property",
  required: false,
  clean: (value) => util.types.toString(value) || undefined,
});

export const connectionInput = input({
  label: "Connection",
  type: "connection",
  required: true,
});

export const portfolioId = input({
  label: "Portfolio ID",
  type: "string",
  example: "843750385",
  comments: "Provide the unique identifier of the portfolio.",
  required: true,
  clean: validateId,
});

export const color = input({
  label: "Color",
  type: "string",
  model: colorInputOptions,
  default: "light-green",
  comments: "Provide a value for the color of the object.",
  required: true,
  clean: util.types.toString,
});

export const members = input({
  label: "Members",
  type: "string",
  example: "843750385",
  comments:
    "For each value, provide the user id of a member. These can either be the string 'me', an email, or the gid of a user.",
  required: false,
  collection: "valuelist",
});

export const portfolioName = input({
  label: "Portfolio Name",
  type: "string",
  example: "My Portfolio",
  comments: "Give a name to the portfolio",
  required: true,
});

export const itemId = input({
  label: "Item ID",
  type: "string",
  example: "843750385",
  comments: "Provide the unique identifier of the Item.",
  required: true,
  clean: validateId,
});

export const fieldId = input({
  label: "Field ID",
  type: "string",
  example: "843750385",
  comments: "The unique identifier of the field",
  required: true,
  clean: validateId,
});

export const sectionId = input({
  label: "Section ID",
  type: "string",
  example: "843750385",
  comments: "The unique identifier of the section",
  required: true,
  clean: validateId,
});

export const tagId = input({
  label: "Tag ID",
  type: "string",
  example: "843750385",
  comments: "The unique identifier of the tag",
  required: true,
  clean: validateId,
});

export const insertAfter = input({
  label: "Insert After",
  type: "string",
  example: "843750385",
  comments: "The ID of the field or section to insert this one insert after",
  required: false,
  clean: (value) => util.types.toString(value) || undefined,
});

export const insertBefore = input({
  label: "Insert before",
  type: "string",
  example: "843750385",
  comments: "The ID of the field or section to insert this one before",
  required: false,
  clean: (value) => util.types.toString(value) || undefined,
});

export const sectionName = input({
  label: "Section Name",
  type: "string",
  example: "843750385",
  comments: "Provide a value for the name of the section",
  required: true,
});

export const attachmentId = input({
  label: "Attachment ID",
  type: "string",
  example: "843750385",
  comments: "Provide an id for the given attachment",
  required: true,
  clean: validateId,
});

export const isImportant = input({
  label: "Is Important",
  type: "boolean",
  default: "true",
  comments: "Determines if the custom field will be marked as important",
  required: true,
  clean: util.types.toBool,
});

export const currencyCode = input({
  label: "Currency Code",
  type: "string",
  example: "USD",
  comments: "Provide a valid currency code",
  required: false,
});

export const customLabel = input({
  label: "Custom Label",
  type: "string",
  example: "USD",
  comments: "Provide a value for the label ",
  required: false,
});

export const customLabelPosition = input({
  label: "Custom Label Position",
  type: "string",
  example: "suffix",
  comments: "Provide a value for the label position",
  required: false,
});

export const description = input({
  label: "Description",
  type: "string",
  example: "This is an example description.",
  comments: "Provide a value for the description.",
  required: false,
});

export const enabled = input({
  label: "Enabled",
  type: "boolean",
  comments: "Determines if the custom field is enabled",
  required: false,
  clean: util.types.toBool,
});

export const enumOptions = input({
  label: "Enum Options",
  type: "code",
  language: "json",
  example: `[
  {
    color: "blue",
    enabled: true,
    name: "Low",
  },
]`,
  comments: "Provide a value for the label ",
  required: false,
});

export const enableNotifications = input({
  label: "Enable Notifications",
  type: "boolean",
  comments:
    "Determines if notifications will be enabled for the custom field. ",
  required: false,
});

export const numberValue = input({
  label: "Number Value",
  type: "string",
  comments: "Provide a number value for the custom field.",
  required: false,
  example: "5.2",
  clean: util.types.toNumber,
});

export const precision = input({
  label: "Precision",
  type: "string",
  comments: "Provide a integer value for the precision property.",
  required: false,
  example: "2",
});

export const textValue = input({
  label: "Text Value",
  type: "string",
  comments: "Provide a text value for the custom field",
  required: false,
  example: "2",
});

export const fileData = input({
  label: "File Data",
  type: "data",
  comments: "Provide the data to upload to the given task.",
  required: true,
  example: "These are my file contents.",
});
