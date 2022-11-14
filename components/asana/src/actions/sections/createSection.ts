import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  connectionInput,
  insertAfter,
  insertBefore,
  sectionName,
  projectId,
} from "../../inputs";

export const createSection = action({
  display: {
    label: "Create Section",
    description: "Create a new section of a project",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(
      `/projects/${params.projectId}/sections`,
      {
        data: {
          insert_after: params.insertAfter,
          insert_before: params.insertBefore,
          name: params.sectionName,
        },
      },
      { params: { opt_fields: "created_at,project,name,resource_type,gid" } }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    projectId,
    connectionInput,
    insertAfter,
    insertBefore,
    sectionName,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202465892953048",
        resource_type: "section",
        created_at: "2022-06-17T15:53:48.455Z",
        name: "My Example Section",
        project: { gid: "1202178854270532", resource_type: "project" },
      },
    },
  },
});
