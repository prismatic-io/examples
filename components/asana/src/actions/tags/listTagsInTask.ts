import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { limit, offset, connectionInput, taskId } from "../../inputs";
import { TAG_OPT_FIELDS } from "../../util";

export const listTagsInTask = action({
  display: {
    label: "List Tags In Task",
    description: "List all tags in a given task",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/tasks/${params.taskId}/tags`, {
      params: {
        limit: params.limit,
        offset: params.offset,
        opt_fields: TAG_OPT_FIELDS,
      },
    });
    return { data };
  },
  inputs: { asanaConnection: connectionInput, taskId, limit, offset },
  examplePayload: {
    data: {
      data: [
        {
          gid: "1202453664069905",
          color: "light-green",
          created_at: "2022-06-15T17:32:21.828Z",
          followers: [],
          name: "My example tag",
          resource_type: "tag",
          workspace: { gid: "1126509132283071", resource_type: "workspace" },
        },
      ],
    },
  },
});
