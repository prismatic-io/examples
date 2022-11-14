import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  connectionInput,
  followersList,
  color,
  name,
  notes,
  workspaceId,
} from "../../inputs";

export const createTag = action({
  display: {
    label: "Create Tag",
    description: "Create a new tag",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(
      `/tags`,
      {
        data: {
          color: params.color,
          followers: params.followersList,
          name: params.name,
          notes: params.notes,
          workspace: params.workspaceId,
        },
      },
      {
        params: {
          opt_fields:
            "resource_type,gid,created_at,followers,name,color,workspace",
        },
      }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    workspaceId,
    followersList,
    color,
    name,
    notes,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202453507919841",
        resource_type: "tag",
        create_at: "2022-06-15T17:03:26.911Z",
        name: "My Example Tag",
        workspace: {
          gid: 1126509132283071,
          resource_type: "workspace",
        },
        color: "light-green",
        followers: [],
      },
    },
  },
});
