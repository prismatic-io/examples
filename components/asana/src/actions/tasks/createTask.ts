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
  projectList,
  parentId,
  notes,
  name,
  isLiked,
  followersList,
  dueAt,
  dueOn,
  connectionInput,
} from "../../inputs";

export const createTask = action({
  display: {
    label: "Create Task",
    description: "Create a new task inside a workspace or organization",
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
        completed_by: params.completedBy,
        due_at: params.dueAt || undefined,
        due_on: params.dueOn || undefined,
        followers: params.followersList || undefined,
        liked: params.isLiked,
        name: params.name,
        notes: params.notes,
        parent: params.parentId || undefined,
        projects: params.projectList || undefined,
        resource_subtype: params.resourceSubtype || undefined,
        start_on: params.startOn || undefined,
        workspace: params.workspaceId || undefined,
      },
    };
    const { data } = await client.post(`/tasks`, taskData, {
      params: {
        opt_fields:
          "projects,resource_subtype,assignee,assignee_status,created_at,completed,gid,resource_type,completed_at,dependencies,custom_fields,dependents,due_on,due_at,followers,external,is_rendered_as_separator,liked,likes,memberships,modified_at,name,notes,html_notes,num_likes,num_subtasks,parent,start_on,workspace,tags",
      },
    });
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    approvalStatus,
    isCompleted,
    completedBy,
    assigneeId,
    assigneeSectionId,
    assigneeStatus,
    workspaceId,
    startOn,
    resourceSubtype,
    projectList,
    parentId,
    notes,
    name,
    isLiked,
    followersList,
    dueAt,
    dueOn,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202461248558215",
        projects: [],
        memberships: [],
        resource_type: "task",
        created_at: "2022-06-16T20:30:21.641Z",
        modified_at: "2022-06-16T20:30:21.932Z",
        name: "My Task Name",
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
        liked: false,
        num_likes: 0,
        followers: [{ gid: "1202178852626547", resource_type: "user" }],
        html_notes: "<body>Here's my task notes!</body>",
        parent: null,
        likes: [],
      },
    },
  },
});
