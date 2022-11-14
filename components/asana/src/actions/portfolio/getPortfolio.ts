import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, portfolioId } from "../../inputs";
import { portfolioPayload } from "./portfolioPayload";

export const getPortfolio = action({
  display: {
    label: "Get Portfolio",
    description: "Get the information and metadata of a portfolio",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/portfolios/${params.portfolioId}`);
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    portfolioId,
  },
  examplePayload: portfolioPayload,
});
