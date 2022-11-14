import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  projectColor,
  defaultView,
  dueOn,
  archived,
  followers,
  name,
  notes,
  owner,
  isPublic,
  startOn,
  team,
  workspaceId,
  connectionInput,
} from "../../inputs";

export const createProjects = action({
  display: {
    label: "Create Project",
    description:
      "Create a new project inside of an existing team or organization",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const projectData = {
      data: {
        archived: params.archived,
        color: params.projectColor,
        default_view: params.defaultView,
        due_on: params.dueOn,
        followers: params.followers,
        name: params.name,
        notes: params.notes,
        owner: params.owner,
        public: params.isPublic,
        start_on: params.startOn,
        team: params.team,
      },
    };

    const endpoint = params.workspaceId
      ? `workspaces/${params.workspaceId}/projects`
      : "/projects";

    const { data } = await client.post(endpoint, projectData, {
      params: {
        opt_fields:
          "layout,team,workspace,html_notes,notes,color,custom_field_settings,custom_fields,followers,members,public,archived,modified_at,created_at,start_on,due_on,current_status,owner,name,resource_type,gid",
      },
    });
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    owner,
    projectColor,
    defaultView,
    dueOn,
    archived,
    followers,
    name,
    notes,
    startOn,
    isPublic,
    workspaceId: {
      ...workspaceId,
      required: false,
      comments:
        "Include this value if you would like this project to be included in a workspace.",
    },
    team: { ...team, required: true },
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202461772995112",
        resource_type: "project",
        created_at: "2022-06-16T22:53:48.986Z",
        modified_at: "2022-06-16T22:53:48.986Z",
        members: [{ gid: "1202178852626547", resource_type: "user" }],
        owner: { gid: "1202178852626547", resource_type: "user" },
        due_on: null,
        current_status: null,
        public: false,
        name: "My Cool Project",
        notes: "Some notes on my project",
        archived: false,
        workspace: { gid: "1126509132283071", resource_type: "workspace" },
        team: { gid: "1202178854270529", resource_type: "team" },
        start_on: null,
        color: "light-green",
        followers: [{ gid: "1202178852626547", resource_type: "user" }],
        html_notes: "<body>Some notes on my project</body>",
      },
    },
  },
});
