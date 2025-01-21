import { input, util } from "@prismatic-io/spectral";
import { valueListInputClean } from "./utils";
import { SearchAllSort, Sort, SortDir } from "./interfaces";

export const message = input({
  label: "Message",
  placeholder: "Message to send",
  type: "text",
  required: true,
  comments: "The message to send the Slack channel.",
  example: "Hello from Prismatic!",
  clean: util.types.toString,
});

export const messageId = input({
  label: "Message Id",
  type: "string",
  required: true,
  comments:
    "A unique identifier of a message or thread to reply to (thread_ts)",
  example: "84350944036",
  clean: util.types.toString,
});

// .sendMessage can take a channel name or ID
export const channelName = input({
  label: "Channel Name or ID",
  type: "string",
  required: true,
  comments: "The name or static ID of the Slack channel.",
  example: "general",
  clean: util.types.toString,
});

// update, delete message only take channel ID
export const channelId = input({
  label: "Channel ID",
  type: "string",
  required: true,
  comments: "The static ID of the Slack channel.",
  example: "C02MS7HV6KB",
  clean: util.types.toString,
});

export const conversationName = input({
  label: "Conversation Name",
  type: "string",
  required: true,
  comments: "The name of the Slack conversation.",
  example: "Book Club",
  clean: util.types.toString,
});

export const isPrivate = input({
  label: "Is Private",
  type: "boolean",
  required: true,
  comments: "This flag will determine if the Slack conversation is private.",
  clean: util.types.toBool,
});

export const teamId = input({
  label: "Team Id",
  type: "string",
  required: false,
  comments: "The Id of the Slack team.",
  example: "84350944036",
  clean: util.types.toString,
});

export const username = input({
  label: "Bot Username",
  type: "string",
  required: false,
  comments:
    "The username of the bot the message will be sent from. This requires the 'chat:write.customize' scope.",
  example: "exampleUser",
  clean: util.types.toString,
});

export const userId = input({
  label: "User Id",
  type: "string",
  required: true,
  example: "84350944036",
  comments:
    "Provide a string value for the unique identifier of the user you want to send the message to.",
  clean: util.types.toString,
});

export const email = input({
  label: "Email",
  type: "string",
  required: true,
  example: "someone@example.com",
  comments: "Provide a string value for the email address of the user.",
  clean: util.types.toString,
});

export const cursor = input({
  label: "Cursor",
  type: "string",
  required: false,
  comments: "Provide a cursor pointing to the page you would like to access",
  example: "3",
  clean: util.types.toString,
});

export const excludeArchived = input({
  label: "Exclude Archived",
  type: "boolean",
  required: false,
  comments:
    "This flag will determine if archived results will be excluded from the result set.",
  clean: util.types.toBool,
});

export const limit = input({
  label: "Limit",
  type: "string",
  required: false,
  example: "80",
  comments: "Provide a numerical limit to the amount of results returned.",
  clean: (value: unknown) => util.types.toNumber(value, 80),
});

export const debug = input({
  label: "Debug",
  type: "boolean",
  required: false,
  comments: "When true, the payload will be logged.",
  clean: util.types.toBool,
});

export const connectionInput = input({
  label: "Connection",
  type: "connection",
  required: true,
  comments: "The connection to use",
});

export const blocks = input({
  label: "Blocks",
  type: "code",
  language: "json",
  required: true,
  default: JSON.stringify(
    {
      blocks: [
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "Hello world",
          },
        },
      ],
    },
    null,
    2,
  ),
  comments:
    "A JSON array containing blocks (objects) that make up the desired message. Use Slack's Block Kit Builder (https://app.slack.com/block-kit-builder/) to build block messages.",
  clean: (block) => {
    const value = util.types.isJSON(util.types.toString(block))
      ? JSON.parse(util.types.toString(block))
      : block;

    return "blocks" in value ? value : { blocks: value };
  },
});

export const includePublicChannels = input({
  label: "Include public channels?",
  type: "boolean",
  default: "true",
  clean: util.types.toBool,
});

export const includePrivateChannels = input({
  label: "Include private channels?",
  type: "boolean",
  default: "false",
  clean: util.types.toBool,
});

export const includeMultiPartyImchannels = input({
  label: "Include multi-party IM (mpim) channels?",
  type: "boolean",
  default: "false",
  clean: util.types.toBool,
});

export const includeImChannels = input({
  label: "Include IM channels?",
  type: "boolean",
  default: "false",
  clean: util.types.toBool,
});

export const includeAllMetadata = input({
  label: "Include All Metadata",
  type: "boolean",
  clean: util.types.toBool,
});

export const inclusive = input({
  label: "Inclusive",
  comments:
    "Include messages with oldest or latest timestamps in results. Ignored unless either timestamp is specified",
  type: "boolean",
  required: false,
  clean: util.types.toBool,
});

export const latest = input({
  label: "Latest",
  comments:
    "Only messages before this Unix timestamp will be included in results. Default is current time.",
  type: "string",
  required: false,
  clean: util.types.toString,
});

export const oldest = input({
  label: "Oldest",
  comments:
    "Only messages after this Unix timestamp will be included in results",
  type: "string",
  required: false,
  clean: util.types.toString,
});

export const conversationPurpose = input({
  label: "Conversation Purpose",
  type: "string",
  comments: "Provide a string value for the purpose of the given conversation.",
  example: "Engineering",
  required: true,
  clean: util.types.toString,
});

export const conversationTopic = input({
  label: "Conversation Topic",
  type: "string",
  comments: "Provide a string value for the topic of the given conversation.",
  example: "Engineering",
  required: true,
  clean: util.types.toString,
});

export const fileContent = input({
  label: "File Content",
  type: "data",
  comments: "Provide the data for a file to be uploaded",
  required: true,
  clean: util.types.toData,
});

export const fileName = input({
  label: "File Name",
  type: "string",
  comments: "Provide a name for the file.",
  required: true,
  example: "reports.csv",
  clean: util.types.toString,
});

export const fileType = input({
  label: "File Type",
  type: "string",
  required: true,
  example: "csv",
  comments:
    "A full list of supported file types can be found here: https://api.slack.com/types/file#file_types",
  clean: util.types.toString,
});

export const fileTitle = input({
  label: "File Title",
  type: "string",
  required: false,
  example: "Monthly Reports",
  comments: "The title of the file as it will appear in the channel",
  clean: util.types.toString,
});

export const channels = input({
  label: "Channels",
  type: "string",
  required: false,
  example: "C02B0APBKP1, C02B0APBKP2, C02B0APBKP3",
  comments:
    "Provide a comma separated list of channel IDs that the file will be shared in.",
  clean: util.types.toString,
});

export const initialComment = input({
  label: "Initial Comment",
  type: "string",
  required: false,
  example: "Example message",
  comments:
    "The message text introducing the file in the specified channels when uploaded",
  clean: util.types.toString,
});

export const thread = input({
  label: "Thread Reply",
  type: "string",
  required: false,
  example: "u830hd230",
  comments:
    "Provide another message's ts value to upload this file as a reply. Never use a reply's ts value, use the parent instead.",
  clean: util.types.toString,
});

export const trigger_id = input({
  label: "Trigger ID",
  type: "string",
  required: true,
  comments: "Exchange a trigger to post to the user.",
  example: "12345.98765.abcd2358fdea",
  clean: util.types.toString,
});

export const view_id = input({
  label: "View ID",
  type: "string",
  required: false,
  comments:
    "A unique identifier of the view to be updated. Either view_id or external_id is required.",
  example: "VMM512F2U",
  clean: util.types.toString,
});

export const external_id = input({
  label: "External ID",
  type: "string",
  required: false,
  comments:
    "A unique identifier of the view to be updated. Either view_id or external_id is required.",
  example: "bmarley_view2",
  clean: util.types.toString,
});

export const view = input({
  label: "View",
  type: "code",
  language: "json",
  required: true,
  default: JSON.stringify(
    {
      type: "modal",
      title: {
        type: "plain_text",
        text: "Modal title",
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "It's Block Kit...but _in a modal_",
          },
          block_id: "section1",
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Click me",
            },
            action_id: "button_abc",
            value: "Button value",
            style: "danger",
          },
        },
        {
          type: "input",
          label: {
            type: "plain_text",
            text: "Input label",
          },
          element: {
            type: "plain_text_input",
            action_id: "input1",
            placeholder: {
              type: "plain_text",
              text: "Type in here",
            },
            multiline: false,
          },
          optional: false,
        },
      ],
      close: {
        type: "plain_text",
        text: "Cancel",
      },
      submit: {
        type: "plain_text",
        text: "Save",
      },
      private_metadata: "Shhhhhhhh",
      callback_id: "view_identifier_12",
    },
    null,
    2,
  ),
  comments:
    "A view payload (https://api.slack.com/reference/surfaces/views). This must be a JSON-encoded string.",
  clean: (value: unknown) => {
    return JSON.parse(util.types.toString(value));
  },
});

export const connected_team_ids = input({
  label: "Connected Team Ids",
  type: "string",
  collection: "valuelist",
  required: false,
  comments:
    "Array of encoded team IDs, signifying the external orgs to search through.",
  example: "T00000000",
  clean: valueListInputClean,
});

export const team_ids = input({
  label: "Team Ids",
  type: "string",
  collection: "valuelist",
  required: false,
  comments:
    "Array of team IDs, signifying the internal workspaces to search through.",
  example: "T00000000",
  clean: valueListInputClean,
});

export const search_channel_types = input({
  label: "Search Channel Types",
  type: "string",
  collection: "valuelist",
  model: [
    "private",
    "private_exclude",
    "archived",
    "exclude_archived",
    "private_exclude_archived",
    "multi_workspace",
    "org_wide",
    "external_shared_exclude",
    "external_shared",
    "external_shared_private",
    "external_shared_archived",
    "exclude_org_shared",
  ].map((value) => ({ value, label: value })),
  required: false,
  comments:
    "The type of channel to include or exclude in the search. For example private will search private channels, while private_exclude will exclude them",
  clean: valueListInputClean,
});

export const sort = input({
  label: "Sort",
  type: "string",
  model: ["relevant", "name", "member_count", "created"].map((value) => ({
    value,
    label: value,
  })),
  default: "member_count",
  required: false,
  comments:
    "The method to sort the results. For example, member_count will sort by the number of members in the channel.",
  clean: (value: unknown) => util.types.toString(value, "member_count") as Sort,
});

export const sortSearch = input({
  label: "Sort",
  type: "string",
  model: ["score", "timestamp"].map((value) => ({
    value,
    label: value,
  })),
  default: "score",
  required: false,
  comments:
    "The method to sort the results. For example, member_count will sort by the number of members in the channel.",
  clean: (value: unknown) =>
    util.types.toString(value, "score") as SearchAllSort,
});

export const sort_dir = input({
  label: "Sort Direction",
  type: "string",
  model: ["desc", "asc"].map((value) => ({
    value,
    label: value,
  })),
  default: "desc",
  required: false,
  comments:
    "The direction to sort the results. For example, desc will sort the results in descending order.",
  clean: (value: unknown) => util.types.toString(value, "desc") as SortDir,
});

export const total_count_only = input({
  label: "Total Count Only",
  type: "boolean",
  required: false,
  comments:
    "Only return the total_count of channels. Omits channel data and allows access for admins without channel manager permissions.",
  clean: util.types.toBool,
});

export const query = input({
  label: "Query",
  type: "string",
  required: true,
  comments: "Search query. May contains booleans, etc.",
  example: "pickleface",
  clean: util.types.toString,
});

export const team_id = input({
  label: "Team Id",
  type: "string",
  required: false,
  comments: "Encoded team id to search in, required if org token is used",
  example: "T1234567890",
  clean: util.types.toString,
});

export const highlight = input({
  label: "Highlight",
  type: "boolean",
  required: false,
  comments: "Pass a value of true to enable query highlight markers.",
  example: "false",
  clean: util.types.toBool,
});

export const page = input({
  label: "Page",
  type: "string",
  required: false,
  comments: "Page number of results to return.",
  example: "1",
  default: "1",
  clean: (value: unknown) => util.types.toNumber(value, 1),
});

export const fetchAll = input({
  label: "Fetch All",
  type: "boolean",
  required: false,
  comments: "Make the action handle pagination, returning all results.",
  clean: util.types.toBool,
});
