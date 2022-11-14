import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, projectId } from "../../inputs";

export const getProject = action({
  display: {
    label: "Get Project",
    description: "Get the information and metadata of a project by Id",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/projects/${params.projectId}`, {
      params: {
        opt_fields:
          "layout,team,workspace,html_notes,notes,color,custom_field_settings,custom_fields,followers,members,public,archived,modified_at,created_at,start_on,due_on,current_status,owner,name,resource_type,gid",
      },
    });
    return { data };
  },
  inputs: { projectId, asanaConnection: connectionInput },
  examplePayload: {
    data: {
      data: {
        gid: "1202461773653662",
        archived: false,
        color: "light-green",
        created_at: "2022-06-16T22:55:11.208Z",
        current_status: null,
        custom_fields: [],
        due_on: null,
        followers: [{ gid: "1202178852626547", resource_type: "user" }],
        html_notes: "<body>My new project notes</body>",
        members: [{ gid: "1202178852626547", resource_type: "user" }],
        modified_at: "2022-06-16T22:55:13.275Z",
        name: "My new project name",
        notes: "My new project notes",
        owner: { gid: "1202178852626547", resource_type: "user" },
        public: true,
        resource_type: "project",
        start_on: null,
        team: { gid: "1202178854270529", resource_type: "team" },
        workspace: { gid: "1126509132283071", resource_type: "workspace" },
      },
    },
  },
});
