import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { offset, limit, workspaceId, connectionInput } from "../../inputs";

export const listProjects = action({
  display: {
    label: "List Projects",
    description: "Return a list of all projects connected to your account",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/projects`, {
      params: {
        offset: params.offset,
        limit: params.limit,
        workspace: params.workspaceId || undefined,
        opt_fields:
          "layout,team,workspace,html_notes,notes,color,custom_field_settings,custom_fields,followers,members,public,archived,modified_at,created_at,start_on,due_on,current_status,owner,name,resource_type,gid",
      },
    });
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    offset,
    limit,
    workspaceId: { ...workspaceId, required: false },
  },
  examplePayload: {
    data: {
      data: [
        {
          gid: "1202178854270532",
          archived: false,
          color: "light-pink",
          created_at: "2022-04-25T19:28:55.557Z",
          current_status: null,
          custom_fields: [],
          due_on: "2022-05-25",
          followers: [{ gid: "1202178852626547", resource_type: "user" }],
          html_notes:
            "<body>Asana helps you plan your 1:1s in advance, stay focused during the conversation, and track notes and action items.</body>",
          members: [{ gid: "1202178852626547", resource_type: "user" }],
          modified_at: "2022-06-15T21:21:40.641Z",
          name: "[Sample] [Teammate] / Prismatic 1:1",
          notes:
            "Asana helps you plan your 1:1s in advance, stay focused during the conversation, and track notes and action items.",
          owner: { gid: "1202178852626547", resource_type: "user" },
          public: false,
          resource_type: "project",
          start_on: "2022-04-25",
          team: { gid: "1202178854270529", resource_type: "team" },
          workspace: { gid: "1126509132283071", resource_type: "workspace" },
        },
      ],
    },
  },
});
