import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { limit, offset, connectionInput, taskId } from "../../inputs";

export const listSubtasks = action({
  display: {
    label: "List Subtasks",
    description: "Return a list of all subtasks in a given task",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);

    const { data } = await client.get(`/tasks/${params.taskId}/subtasks`, {
      params: {
        limit: params.limit,
        offset: params.offset,
        opt_fields:
          "projects,resource_subtype,assignee,assignee_status,created_at,completed,gid,resource_type,completed_at,dependencies,custom_fields,dependents,due_on,due_at,followers,external,is_rendered_as_separator,liked,likes,memberships,modified_at,name,notes,html_notes,num_likes,num_subtasks,parent,start_on,workspace,tags",
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
          gid: "1202461528125029",
          assignee: { gid: "1202178852626547", resource_type: "user" },
          assignee_status: "inbox",
          completed: false,
          completed_at: null,
          created_at: "2022-06-16T21:31:46.425Z",
          due_at: null,
          due_on: null,
          followers: [{ gid: "1202178852626547", resource_type: "user" }],
          html_notes: "<body>Here's my task notes!</body>",
          is_rendered_as_separator: false,
          liked: false,
          likes: [],
          memberships: [],
          modified_at: "2022-06-16T21:31:54.809Z",
          name: "My new task name",
          notes: "Here's my task notes!",
          num_likes: 0,
          num_subtasks: 0,
          parent: { gid: "1202178854270531", resource_type: "task" },
          projects: [],
          resource_type: "task",
          start_on: null,
          tags: [{ gid: "1202453664069905", resource_type: "tag" }],
          resource_subtype: "default_task",
          workspace: { gid: "1126509132283071", resource_type: "workspace" },
        },
      ],
    },
  },
});
