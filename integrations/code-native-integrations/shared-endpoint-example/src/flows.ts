import axios from "axios";
import { flow } from "@prismatic-io/spectral";

const flowMapper = {
  create_opportunity: "Create Opportunity",
  update_opportunity: "Update Opportunity",
};

interface CreateOpportunityPayload {
  event: "create_opportunity";
  opportunity: {
    name: string;
    amount: number;
  };
}

interface UpdateOpportunityPayload {
  event: "update_opportunity";
  opportunity: {
    id: string;
    name: string;
    amount: number;
  };
}

type Payload = CreateOpportunityPayload | UpdateOpportunityPayload;

export const myPreprocessFlow = flow({
  name: "My Preprocess Flow",
  stableKey: "my-preprocess-flow",
  preprocessFlowConfig: { flowNameField: "myFlowName" },
  description: "This determines which sibling flow should be invoked",
  onTrigger: async (context, payload) => Promise.resolve({ payload }),
  onExecution: async (context, params) => {
    const event = (params.onTrigger.results.body.data as Payload).event;

    return Promise.resolve({
      data: {
        myFlowName: flowMapper[event],
      },
    });
  },
});

export const createOpportunity = flow({
  name: "Create Opportunity",
  stableKey: "create-opportunity",
  description: "This flow creates an opportunity",
  onTrigger: async (context, payload) => Promise.resolve({ payload }),
  onExecution: async (context, params) => {
    const { opportunity } = params.onTrigger.results.body
      .data as CreateOpportunityPayload;
    context.logger.info(
      `Creating opportunity ${opportunity.name} for ${opportunity.amount}`
    );
    const response = await axios.post("https://postman-echo.com/post", {
      oppName: opportunity.name,
      oppAmount: opportunity.amount,
    });
    return Promise.resolve({
      data: response.data,
    });
  },
});

export const updateOpportunity = flow({
  name: "Update Opportunity",
  stableKey: "update-opportunity",
  description: "This flow updates an opportunity",
  onTrigger: async (context, payload) => Promise.resolve({ payload }),
  onExecution: async (context, params) => {
    const { opportunity } = params.onTrigger.results.body
      .data as UpdateOpportunityPayload;
    context.logger.info(
      `Updating opportunity ${opportunity.name} for ${opportunity.amount}`
    );
    const response = await axios.post("https://postman-echo.com/post", {
      id: opportunity.id,
      oppName: opportunity.name,
      oppAmount: opportunity.amount,
    });
    return Promise.resolve({
      data: response.data,
    });
  },
});

export default [myPreprocessFlow, createOpportunity, updateOpportunity];
