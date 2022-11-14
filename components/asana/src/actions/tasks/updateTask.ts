import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  approvalStatus,
  isCompleted,
  completedBy,
  assigneeId,
  assigneeSectionId,
  assigneeStatus,
  workspaceId,
  startOn,
  resourceSubtype,
  parentId,
  notes,
  name,
  isLiked,
  dueAt,
  dueOn,
  taskId,
  connectionInput,
} from "../../inputs";

export const updateTask = action({
  display: {
    label: "Update Task",
    description: "Update the information and metadata of the given task",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);

    const taskData = {
      data: {
        approval_status: params.approvalStatus,
        assignee: params.assigneeId,
        assignee_section: params.assigneeSectionId,
        assignee_status: params.assigneeStatus,
        completed: params.isCompleted,
        completed_by: params.completedBy
          ? { name: params.completedBy }
          : undefined,
        due_at: params.dueAt,
        due_on: params.dueOn,
        liked: params.isLiked,
        name: params.name,
        notes: params.notes,
        parent: params.parentId,
        resource_subtype: params.resourceSubtype,
        start_on: params.startOn,
        workspace: params.workspaceId || undefined,
      },
    };

    const { data } = await client.put(`/tasks/${params.taskId}`, taskData, {
      params: {
        opt_fields:
          "projects,resource_subtype,assignee,assignee_status,created_at,completed,gid,resource_type,completed_at,dependencies,custom_fields,dependents,due_on,due_at,followers,external,is_rendered_as_separator,liked,likes,memberships,modified_at,name,notes,html_notes,num_likes,num_subtasks,parent,start_on,workspace,tags",
      },
    });
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    taskId,
    approvalStatus: { ...approvalStatus, required: false },
    isCompleted,
    completedBy,
    assigneeId: { ...assigneeId, required: false },
    assigneeSectionId,
    assigneeStatus,
    workspaceId: { ...workspaceId, required: false },
    startOn,
    resourceSubtype,
    parentId,
    notes,
    name,
    isLiked,
    dueAt,
    dueOn,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202461395122529",
        projects: [],
        memberships: [],
        resource_type: "task",
        created_at: "2022-06-16T21:15:12.578Z",
        modified_at: "2022-06-16T21:15:14.361Z",
        name: "My new task name",
        is_rendered_as_separator: false,
        notes: "Here's my task notes!",
        assignee: { gid: "1202178852626547", resource_type: "user" },
        completed: false,
        assignee_status: "inbox",
        completed_at: null,
        due_on: null,
        due_at: null,
        resource_subtype: "default_task",
        start_on: null,
        tags: [],
        workspace: { gid: "1126509132283071", resource_type: "workspace" },
        num_likes: 0,
        html_notes: "<body>Here's my task notes!</body>",
        parent: null,
        liked: false,
        likes: [],
        followers: [],
      },
    },
  },
});
