import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, projectId, offset, limit } from "../../inputs";

export const listSections = action({
  display: {
    label: "List Sections",
    description: "List all sections of the given project",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(
      `/projects/${params.projectId}/sections`,
      {
        params: {
          offset: params.offset,
          limit: params.limit,
          opt_fields: "created_at,project,name,resource_type,gid",
        },
      }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    projectId,
    offset,
    limit,
  },
  examplePayload: {
    data: {
      data: [
        {
          gid: "1202178854270533",
          created_at: "2022-04-25T19:28:56.749Z",
          name: "Discussion topics",
          project: { gid: "1202178854270532", resource_type: "project" },
          resource_type: "section",
        },
        {
          gid: "1202178854270541",
          created_at: "2022-04-25T19:28:59.950Z",
          name: "FYIs",
          project: { gid: "1202178854270532", resource_type: "project" },
          resource_type: "section",
        },
      ],
    },
  },
});
