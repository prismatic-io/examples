import { action, util } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, portfolioId, offset, limit } from "../../inputs";

export const listPortfolioItems = action({
  display: {
    label: "List Portfolio Items",
    description: "List all items in a given portfolio",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(
      `/portfolios/${params.portfolioId}/items`,
      {
        params: {
          offset: params.offset,
          limit: params.limit,
        },
      }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    portfolioId,
    offset,
    limit,
  },
  examplePayload: {
    data: {
      data: [
        {
          gid: "12345",
          resource_type: "project",
          name: "Stuff to buy",
        },
      ],
    },
  },
});
