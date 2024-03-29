import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { taskId, connectionInput } from "../../inputs";
import { TASK_OPT_FIELDS } from "../../util";

export const getTask = action({
  display: {
    label: "Get Task",
    description: "Get the information and metadata of a task",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/tasks/${params.taskId}`, {
      params: {
        opt_fields: TASK_OPT_FIELDS,
      },
    });
    return { data };
  },
  inputs: { asanaConnection: connectionInput, taskId },
  examplePayload: {
    data: {
      data: {
        gid: "75834703724",
        projects: "",
        resource_type: "task",
        name: "MyTask",
        notes: "These are my example task notes!",
        completed: false,
        resource_subtype: "default_task",
        tags: "",
        workspace: {
          gid: "867452364563",
          resource_type: "workspace",
          name: "Example Workspace",
        },
        custom_fields: {},
        assignee: {
          gid: "32493284234",
          name: "Example Assignee",
          resource_type: "user",
        },
        parent: null,
        assignee_status: "inbox",
        hearted: false,
      },
    },
  },
});
