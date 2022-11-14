import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  connectionInput,
  portfolioId,
  color,
  portfolioName,
  workspaceId,
  isPublic,
} from "../../inputs";
import { portfolioPayload } from "./portfolioPayload";

export const updatePortfolio = action({
  display: {
    label: "Update Portfolio",
    description: "Update the information and metadata of the given portfolio",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.put(`/portfolios/${params.portfolioId}`, {
      data: {
        color: params.color || undefined,
        name: params.portfolioName || undefined,
        public: params.isPublic,
        workspace: params.workspaceId || undefined,
      },
    });
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    portfolioId,
    color: { ...color, required: false },
    portfolioName: { ...portfolioName, required: false },
    workspaceId: { ...workspaceId, required: false },
    isPublic,
  },
  examplePayload: portfolioPayload,
});
