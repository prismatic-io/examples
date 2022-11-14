import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, portfolioId, members } from "../../inputs";

export const addUserToPortfolio = action({
  display: {
    label: "Add Users To Portfolio",
    description: "Add existing users to the given portfolio",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(
      `/portfolios/${params.portfolioId}/addMembers`,
      {
        data: {
          members: params.members,
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
        gid: "1202474374782519",
        resource_type: "portfolio",
        created_at: "2022-06-20T16:48:04.621Z",
        created_by: {
          gid: "1202467472237333",
          resource_type: "user",
          name: "Example User",
        },
        owner: {
          gid: "1202467472237333",
          resource_type: "user",
          name: "Example User",
        },
        name: "My Portfolio",
        public: true,
        members: [
          {
            gid: "1202467472237333",
            resource_type: "user",
            name: "Example User",
          },
          {
            gid: "1202467584678838",
            resource_type: "user",
            name: "Developer Name",
          },
        ],
        custom_field_settings: [],
        workspace: {
          gid: "1202467471973207",
          resource_type: "workspace",
          name: "Example Workspace",
        },
        permalink_url: "https://app.asana.com/0/portfolio/1202474374782519",
        color: "none",
        due_on: null,
        start_on: null,
        current_status_update: {
          gid: "1202475750145512",
          resource_type: "status_update",
          title: "This Portfolio of work is on track!",
        },
      },
    },
  },
});
