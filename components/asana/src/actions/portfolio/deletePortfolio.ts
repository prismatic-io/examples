import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, portfolioId } from "../../inputs";

export const deletePortfolio = action({
  display: {
    label: "Delete Portfolio",
    description: "Delete the information and metadata of a portfolio",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.delete(`/portfolios/${params.portfolioId}`);
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    portfolioId,
  },
  examplePayload: { data: { data: {} } },
});
