import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { limit, offset, connectionInput, workspaceId } from "../../inputs";

export const listTags = action({
  display: {
    label: "List Tags",
    description: "List all tags in your account",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`workspaces/${params.workspaceId}/tags`, {
      params: {
        limit: params.limit,
        offset: params.offset,
        opt_fields:
          "resource_type,gid,created_at,followers,name,color,workspace",
      },
    });
    return { data };
  },
  inputs: { asanaConnection: connectionInput, workspaceId, limit, offset },
  examplePayload: {
    data: {
      data: [
        {
          gid: "1202453507919841",
          color: "light-green",
          created_at: "2022-06-15T17:03:26.911Z",
          followers: [],
          name: "My example tag",
          resource_type: "tag",
          workspace: { gid: "1126509132283071", resource_type: "workspace" },
        },
      ],
    },
  },
});
