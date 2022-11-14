import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, taskId, tagId } from "../../inputs";

export const removeTagFromTask = action({
  display: {
    label: "Remove Tag From Task",
    description: "Remove a tag from the given task",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(`/tasks/${params.taskId}/removeTag`, {
      data: {
        tag: params.tagId,
      },
    });
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    taskId,
    tagId,
  },
  examplePayload: { data: { data: {} } },
});
