import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  workspaceId,
  assigneeId,
  limit,
  offset,
  connectionInput,
  projectId,
} from "../../inputs";

export const listTasks = action({
  display: {
    label: "List Tasks",
    description: "Return a list of tasks",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/tasks`, {
      params: {
        limit: params.limit,
        offset: params.offset,
        assignee: params.assigneeId || undefined,
        project: params.projectId || undefined,
        workspace: params.workspaceId || undefined,
        opt_fields:
          "projects,resource_subtype,assignee,assignee_status,created_at,completed,gid,resource_type,completed_at,dependencies,custom_fields,dependents,due_on,due_at,followers,external,is_rendered_as_separator,liked,likes,memberships,modified_at,name,notes,html_notes,num_likes,num_subtasks,parent,start_on,workspace,tags",
      },
    });
    return { data };
  },
  inputs: {
    workspaceId: { ...workspaceId, required: false },
    assigneeId: { ...assigneeId, required: false },
    projectId: { ...projectId, required: false },
    limit,
    offset,
    asanaConnection: connectionInput,
  },
  examplePayload: {
    data: {
      data: [
        {
          gid: "1202178854270531",
          assignee: { gid: "1202178852626547", resource_type: "user" },
          assignee_status: "today",
          completed: false,
          completed_at: null,
          created_at: "2022-04-25T19:28:54.408Z",
          due_at: null,
          due_on: "2022-05-02",
          followers: [{ gid: "1202178852626547", resource_type: "user" }],
          html_notes:
            '<body>We’ve collected a set of guides, tips, and tutorials to help you learn about Asana. Check it out:<ul><li><a href="https://asana.com/guide">https://asana.com/guide</a></li></ul></body>',
          is_rendered_as_separator: false,
          liked: false,
          likes: [],
          memberships: [{}],
          modified_at: "2022-06-15T21:21:41.151Z",
          name: "Learn how Asana works",
          notes:
            "We’ve collected a set of guides, tips, and tutorials to help you learn about Asana. Check it out: https://asana.com/guide\n",
          num_likes: 0,
          num_subtasks: 0,
          parent: null,
          projects: [{ gid: "1202178854270532", resource_type: "project" }],
          resource_type: "task",
          start_on: null,
          tags: [
            { gid: "1202453664069905", resource_type: "tag" },
            { gid: "1202454369674628", resource_type: "tag" },
            { gid: "1202454863218026", resource_type: "tag" },
          ],
          resource_subtype: "default_task",
          workspace: { gid: "1126509132283071", resource_type: "workspace" },
        },
      ],
    },
  },
});
