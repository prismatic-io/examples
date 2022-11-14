import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, limit, offset, workspaceId } from "../../inputs";

export const listPortfolios = action({
  display: {
    label: "List Portfolios",
    description: "List portfolios that the authenticated user owns",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);

    // You can only fetch portfolios for the currently authenticated in user
    const {
      data: {
        data: { gid: userGid },
      },
    } = await client.get("/users/me");

    const { data } = await client.get(`/portfolios`, {
      params: {
        offset: params.offset,
        limit: params.limit,
        workspace: params.workspaceId || undefined,
        owner: userGid,
      },
    });

    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    workspaceId,
    limit,
    offset,
  },
  examplePayload: {
    data: {
      data: [
        {
          gid: "12345",
          resource_type: "portfolio",
          name: "Example Portfolio",
        },
      ],
    },
  },
});
