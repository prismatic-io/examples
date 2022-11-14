import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, limit, offset, taskId } from "../../inputs";

export const listAttachments = action({
  display: {
    label: "List task attachments",
    description: "List all attachments in a given task",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/tasks/${params.taskId}/attachments`, {
      params: {
        offset: params.offset,
        limit: params.limit,
      },
    });
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    taskId,
    limit,
    offset,
  },
  examplePayload: {
    data: {
      data: [
        {
          gid: "12345",
          resource_type: "attachment",
          name: "Screenshot.png",
          resource_subtype: "dropbox",
        },
      ],
    },
  },
});
