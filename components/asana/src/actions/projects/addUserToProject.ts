import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, projectId, members } from "../../inputs";

export const addUserToProject = action({
  display: {
    label: "Add Users To Project",
    description: "Add an existing user to the given project",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(
      `/projects/${params.projectId}/addMembers`,
      {
        data: {
          members: params.members,
        },
      },
      {
        params: {
          opt_fields:
            "layout,team,workspace,html_notes,notes,color,custom_field_settings,custom_fields,followers,members,privacy_setting,archived,modified_at,created_at,start_on,due_on,current_status,owner,name,resource_type,gid",
        },
      }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    projectId,
    members,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202461834400501",
        resource_type: "project",
        created_at: "2022-06-16T22:59:28.974Z",
        modified_at: "2022-06-16T22:59:31.222Z",
        members: [{ gid: "1202178852626547", resource_type: "user" }],
        owner: { gid: "1202178852626547", resource_type: "user" },
        due_on: null,
        current_status: null,
        name: "My new project name",
        notes: "My new project notes",
        html_notes: "<body>My new project notes</body>",
        archived: false,
        workspace: { gid: "1126509132283071", resource_type: "workspace" },
        team: { gid: "1202178854270529", resource_type: "team" },
        start_on: null,
        color: "light-green",
        followers: [{ gid: "1202178852626547", resource_type: "user" }],
      },
    },
  },
});
