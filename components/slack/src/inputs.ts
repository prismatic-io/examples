import { input, util } from "@prismatic-io/spectral";

export const message = input({
  label: "Message",
  placeholder: "Message to send",
  type: "string",
  required: true,
  comments: "The message to send the Slack channel.",
  example: "Hello from Prismatic!",
});

export const messageId = input({
  label: "Message Id",
  type: "string",
  required: true,
  comments: "A unique identifier of a message or thread (thread_ts)",
  example: "84350944036",
});

// .sendMessage can take a channel name or ID
export const channelName = input({
  label: "Channel Name or ID",
  type: "string",
  required: true,
  comments: "The name or static ID of the Slack channel.",
  example: "general",
});

// update, delete message only take channel ID
export const channelId = input({
  label: "Channel ID",
  type: "string",
  required: true,
  comments: "The static ID of the Slack channel.",
  example: "C02MS7HV6KB",
});

export const conversationName = input({
  label: "Conversation Name",
  type: "string",
  required: true,
  comments: "The name of the Slack conversation.",
  example: "Book Club",
});

export const isPrivate = input({
  label: "Is Private",
  type: "boolean",
  required: true,
  comments: "This flag will determine if the Slack conversation is private.",
});

export const asUser = input({
  label: "As User",
  type: "boolean",
  required: false,
  comments:
    "This flag will determine if the message will be sent as a user or a bot.",
});

export const teamId = input({
  label: "Team Id",
  type: "string",
  required: false,
  comments: "The Id of the Slack team.",
  example: "84350944036",
});

export const username = input({
  label: "Bot Username",
  type: "string",
  required: false,
  comments: "The username of the bot the message will be sent from.",
  example: "exampleUser",
});

export const userId = input({
  label: "User Id",
  type: "string",
  required: true,
  example: "84350944036",
  comments:
    "Provide a string value for the unique identifier of the user you want to send the message to.",
});

export const email = input({
  label: "Email",
  type: "string",
  required: true,
  example: "someone@example.com",
  comments: "Provide a string value for the email address of the user.",
});

export const cursor = input({
  label: "Cursor",
  type: "string",
  required: false,
  comments: "Provide a cursor pointing to the page you would like to access",
  example: "3",
});

export const excludeArchived = input({
  label: "Exclude Archived",
  type: "boolean",
  required: false,
  comments:
    "This flag will determine if archived results will be excluded from the result set.",
});

export const excludeMembers = input({
  label: "Exclude Members",
  type: "boolean",
  required: false,
  comments:
    "This flag will determine if members of the channel will be excluded from the result set.",
});

export const limit = input({
  label: "Limit",
  type: "string",
  required: false,
  example: "80",
  comments: "Provide a numerical limit to the amount of results returned.",
});

export const validate = input({
  label: "Validate",
  type: "string",
  required: false,
  comments: "This flag will determine if the channel will be validated.",
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
  language: "JSON",
  required: true,
  example: util.docs.formatJsonExample([
    { type: "section", text: { type: "plain_text", text: "Hello world" } },
  ]),
  default: `[
  {
    "type": "section",
    "text": {
      "type": "plain_text",
      "text": "Hello world"
    }
  }
]`,
  comments:
    "Provide a JSON array containing blocks (objects) that make up the desired message.",
});
