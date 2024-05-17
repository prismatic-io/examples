import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, taskId, tagId } from "../../inputs";

export const removeAssigneeFromTask = action({
  display: {
    label: "Remove Assignee From Task",
    description: "Remove the assignee from the given task",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.put(`/tasks/${params.taskId}`, {
      data: {
        assignee: null,
      },
    });
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    taskId,
  },
  examplePayload: { data: { data: {} } },
});
