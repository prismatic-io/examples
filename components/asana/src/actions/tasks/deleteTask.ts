import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { taskId, connectionInput } from "../../inputs";

export const deleteTask = action({
  display: {
    label: "Delete Task",
    description: "Delete the information and metadata of an existing task",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(
      params.asanaConnection,
      context.debug.enabled,
    );
    const { data } = await client.delete(`/tasks/${params.taskId}`);
    return { data };
  },
  inputs: { asanaConnection: connectionInput, taskId },
  examplePayload: { data: { data: {} } },
});
