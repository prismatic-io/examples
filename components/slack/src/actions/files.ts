import { action, util } from "@prismatic-io/spectral";
import { createOauthClient } from "../client";
import { Readable } from "stream";
import { connectionInput, cursor } from "../inputs";
import { handleErrors } from "../errors";

export const listFiles = action({
  display: {
    label: "List Files",
    description: "List all available files",
  },
  perform: async (context, params) => {
    const client = await createOauthClient({
      slackConnection: params.connection,
    });
    const data = await handleErrors(
      client.files.list({
        page: util.types.toInt(params.cursor),
      })
    );
    return { data };
  },
  inputs: { connection: connectionInput, cursor },
});

export const uploadFile = action({
  display: {
    label: "Upload File",
    description: "Upload a new file to a slack conversation",
  },
  perform: async (context, params) => {
    const client = await createOauthClient({
      slackConnection: params.connection,
    });
    const { data: fileData } = util.types.toData(params.fileContent);
    const data = await handleErrors(
      client.files.upload({
        file: Readable.from(fileData),
        filename: util.types.toString(params.fileName),
        title: util.types.toString(params.title) || undefined,
        channels: util.types.toString(params.channels) || undefined,
        content: util.types.toString(params.channels) || undefined,
        filetype: util.types.toString(params.fileType) || undefined,
        initial_comment:
          util.types.toString(params.initialComment) || undefined,
        thread_ts: util.types.toString(params.thread) || undefined,
      })
    );
    return { data };
  },
  inputs: {
    connection: connectionInput,
    fileContent: {
      label: "File Content",
      type: "data",
      comments: "Provide the data for a file to be uploaded",
      required: true,
    },
    fileName: {
      label: "File Name",
      type: "string",
      comments: "Provide a name for the file.",
      required: true,
      example: "reports.csv",
    },
    fileType: {
      label: "File Type",
      type: "string",
      required: true,
      example: "csv",
      comments:
        "A full list of supported file types can be found here: https://api.slack.com/types/file#file_types",
    },
    title: {
      label: "File Title",
      type: "string",
      required: false,
      example: "Monthly Reports",
      comments: "The title of the file as it will appear in the channel",
    },
    channels: {
      label: "Channels",
      type: "string",
      required: false,
      example: "general,marketing",
      comments:
        "Provide a comma separated list of channel names, or ids that the file will be shared in.",
    },
    initialComment: {
      label: "Initial Comment",
      type: "string",
      required: false,
      example: "Example message",
      comments:
        "The message text introducing the file in the specified channels when uploaded",
    },
    thread: {
      label: "Thread Reply",
      type: "string",
      required: false,
      example: "u830hd230",
      comments:
        "Provide another message's ts value to upload this file as a reply. Never use a reply's ts value, use the parent instead.",
    },
    cursor,
  },
});
