import { flow, util } from "@prismatic-io/spectral";
import { Agent, run, setDefaultOpenAIKey, user } from "@openai/agents";
import apiTools from "../agents/tools/api";
import { createPrismaticTools } from "../agents/tools/prismaticHostedTools";
import { ChatRequest } from "../types";

export const integrationsAsTools = flow({
  name: "Integrations as Tools",
  stableKey: "integrations-as-tools",
  description: "Demonstrates using deployed customer instances as tools",
  onTrigger: async (context, payload) => {
    return Promise.resolve({
      payload,
    });
  },
  onExecution: async ({ configVars, customer }, params) => {
    const openaiKey = util.types.toString(
      configVars.OPENAI_API_KEY.fields.apiKey,
    );

    // Set the OpenAI API key
    setDefaultOpenAIKey(openaiKey);

    // Get customer ID from environment and current integration ID from runtime
    const customerExternalId = customer.externalId;
    const currentIntegrationId = params.onTrigger.results.integration?.id;

    // This will fetch all available flows for the customer and convert them to tools
    const prismaticTools = await createPrismaticTools(
      customerExternalId,
      currentIntegrationId, // Exclude self to prevent infinite loops
    );

    if (prismaticTools.length > 0) {
      console.log(
        `[Integrations as Tools] Loaded ${prismaticTools.length} integration tools`,
      );
    }

    // Create agent with both API tools and Prismatic tools
    const agent = new Agent({
      name: "Integration Assistant",
      instructions: `${configVars.SYSTEM_PROMPT}

You are an AI assistant with access to API operations and deployed customer integrations as tools.
Use these tools to help users accomplish their tasks efficiently.`,
      tools: [
        // Standard API tools
        apiTools.getCurrentUserInfo,
        apiTools.getPosts,
        apiTools.getPost,
        apiTools.createPost,
        apiTools.updatePost,
        apiTools.getPostComments,

        // Dynamically loaded customer instance tools (if available)
        ...prismaticTools,
      ],
    });

    // Get the message from the payload
    const { message, conversationId, lastResponseId } = params.onTrigger.results
      .body.data as ChatRequest;

    if (!message) {
      throw new Error("Message is required for integrations as tools");
    }

    // Run the agent with the message
    const result = await run(agent, [user(message)], {
      previousResponseId: lastResponseId,
    });

    // Return the response directly
    return {
      data: {
        response: result.finalOutput,
        lastResponseId: result.lastResponseId,
        conversationId,
      },
    };
  },
});

export default integrationsAsTools;
