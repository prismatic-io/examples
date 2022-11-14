import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { workspaceId, offset, limit, connectionInput } from "../../inputs";

export const listUsers = action({
  display: {
    label: "List Users",
    description: "List all users in your account",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/users`, {
      params: {
        offset: params.offset,
        limit: params.limit,
        workspace: params.workspaceId || undefined,
        opt_fields: "gid,name,resource_type,email,workspaces",
      },
    });
    return { data };
  },
  inputs: {
    workspaceId: {
      ...workspaceId,
      required: false,
      comments: "Optionally filter by workspace ID",
    },
    limit,
    offset,
    asanaConnection: connectionInput,
  },
  examplePayload: {
    data: {
      data: [
        {
          gid: "1126508793140155",
          name: "Example User 1",
          resource_type: "user",
          email: "user-1@example.com",
          workspaces: [
            {
              gid: "1126509132283071",
              resource_type: "workspace",
            },
          ],
        },
        {
          gid: "1126508793140156",
          name: "Example User2 ",
          resource_type: "user",
          email: "user-2@example.com",
          workspaces: [
            {
              gid: "1126509132283071",
              resource_type: "workspace",
            },
          ],
        },
      ],
    },
  },
});
