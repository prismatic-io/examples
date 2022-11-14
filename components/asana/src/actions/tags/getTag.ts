import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, tagId } from "../../inputs";

export const getTag = action({
  display: {
    label: "Get Tag",
    description: "Get the information and metadata of the given tag",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/tags/${params.tagId}`, {
      params: {
        opt_fields:
          "resource_type,gid,created_at,followers,name,color,workspace,notes",
      },
    });
    return { data };
  },
  inputs: { asanaConnection: connectionInput, tagId },
  examplePayload: {
    data: {
      data: {
        gid: "1202461566347259",
        color: "light-green",
        created_at: "2022-06-16T21:44:38.673Z",
        followers: [],
        name: "My Example Tag",
        notes: "My Notes",
        resource_type: "tag",
        workspace: { gid: "1126509132283071", resource_type: "workspace" },
      },
    },
  },
});
