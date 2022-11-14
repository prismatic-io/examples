import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  connectionInput,
  color,
  members,
  portfolioName,
  workspaceId,
  isPublic,
} from "../../inputs";
import { portfolioPayload } from "./portfolioPayload";

export const createPortfolio = action({
  display: {
    label: "Create Portfolio",
    description: "Create a new portfolio",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(`/portfolios`, {
      data: {
        color: params.color,
        name: params.portfolioName,
        public: params.isPublic,
        workspace: params.workspaceId,
      },
    });
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    color,
    members,
    portfolioName,
    workspaceId,
    isPublic,
  },
  examplePayload: portfolioPayload,
});
