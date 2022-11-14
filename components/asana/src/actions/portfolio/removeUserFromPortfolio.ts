import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, members, portfolioId } from "../../inputs";

export const removeUserFromPortfolio = action({
  display: {
    label: "Remove Users From Portfolio",
    description: "Remove existing users from the given portfolio",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(
      `/portfolios/${params.portfolioId}/removeMembers`,
      {
        data: {
          members: params.members,
        },
      },
      {
        params: {
          opt_fields:
            "resource_type,gid,name,created_at,created_by,custom_field_settings,color,workspace,members",
        },
      }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    portfolioId,
    members,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202476367473313",
        resource_type: "portfolio",
        created_at: "2022-06-20T18:18:47.435Z",
        created_by: { gid: "1202467472237333", resource_type: "user" },
        name: "Example Portfolio",
        members: [
          { gid: "1202467472237333", resource_type: "user" },
          { gid: "1202467584678838", resource_type: "user" },
        ],
        custom_field_settings: [],
        workspace: { gid: "1202467471973207", resource_type: "workspace" },
        color: "light-green",
      },
    },
  },
});
