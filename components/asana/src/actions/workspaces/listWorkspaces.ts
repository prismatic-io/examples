import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, limit, offset } from "../../inputs";

export const listWorkspaces = action({
  display: {
    label: "List Workspaces",
    description: "List of all workspaces connected to your account",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get("/workspaces", {
      params: {
        limit: params.limit,
        offset: params.offset,
      },
    });
    return { data };
  },
  inputs: { asanaConnection: connectionInput, limit, offset },
  examplePayload: {
    data: {
      data: [
        {
          gid: "1126509132283071",
          name: "Example Workspace 1",
          resource_type: "workspace",
        },
        {
          gid: "1126509132283072",
          name: "Example Workspace 2",
          resource_type: "workspace",
        },
      ],
    },
  },
});
