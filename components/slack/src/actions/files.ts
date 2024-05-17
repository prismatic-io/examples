import { action, util } from "@prismatic-io/spectral";
import { createOauthClient } from "../client";
import { Readable } from "stream";
import {
  channels,
  connectionInput,
  cursor,
  debug,
  fileContent,
  fileName,
  fileTitle,
  fileType,
  highlight,
  initialComment,
  limit,
  page,
  query,
  sortSearch,
  sort_dir,
  team_id,
  thread,
} from "../inputs";
import {
  listFilesResponse,
  searchFilesResponse,
  uploadFileResponse,
} from "../examplePayloads";
import { debugLogger } from "../utils";

export const listFiles = action({
  display: {
    label: "List Files",
    description: "List all available files",
  },
  perform: async (context, params) => {
    debugLogger(params);
    const client = await createOauthClient({
      slackConnection: params.connection,
    });
    const data = await client.files.list({
      page: util.types.toInt(params.cursor),
    });
    return { data };
  },
  inputs: { connection: connectionInput, cursor, debug },
  examplePayload: {
    data: listFilesResponse as any,
  },
});

export const uploadFile = action({
  display: {
    label: "Upload File",
    description: "Upload a new file to a slack conversation",
  },
  perform: async (context, params) => {
    debugLogger(params);
    const client = await createOauthClient({
      slackConnection: params.connection,
    });
    const { data: fileData } = params.fileContent;
    const data = await client.files.upload({
      file: Readable.from(fileData),
      filename: params.fileName,
      title: params.title || undefined,
      channels: params.channels || undefined,
      content: params.channels || undefined,
      filetype: params.fileType || undefined,
      initial_comment: params.initialComment || undefined,
      thread_ts: params.thread || undefined,
    });
    return { data };
  },
  inputs: {
    connection: connectionInput,
    fileContent,
    fileName,
    fileType,
    title: fileTitle,
    channels,
    initialComment,
    thread,
    debug,
  },
  examplePayload: {
    data: uploadFileResponse,
  },
});

export const searchFiles = action({
  display: {
    label: "Search Files",
    description: "Searches for files matching a query.",
  },
  perform: async (
    context,
    {
      connection,
      debug,
      query,
      sort,
      sort_dir,
      count,
      highlight,
      page,
      team_id,
    }
  ) => {
    debugLogger({
      debug,
      query,
      sort,
      sort_dir,
      count,
      highlight,
      page,
      team_id,
    });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.search.files({
      query,
      sort,
      sort_dir,
      count,
      highlight,
      page,
      team_id,
    });
    return { data };
  },
  inputs: {
    query,
    count: {
      ...limit,
      label: "Count",
      comments: "Number of items to return per page.",
    },
    highlight,
    page,
    sort: sortSearch,
    sort_dir,
    team_id,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: searchFilesResponse,
  },
});
