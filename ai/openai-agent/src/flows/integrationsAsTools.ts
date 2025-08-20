import { flow, util } from "@prismatic-io/spectral";
import { setupAgent } from "../agents/setup";
import apiTools from "../agents/tools/api";
import { createPrismaticTools } from "../agents/tools/prismaticHostedTools";
import { parseFlowInput, buildFlowOutput } from "./utils/flowHelpers";

export const integrationsAsTools = flow({
  name: "Integrations as Tools",
  stableKey: "integrations-as-tools",
  description: "Demonstrates using deployed customer instances as tools",
  onTrigger: async (context, payload) => {
    return Promise.resolve({
      payload,
    });
  },
  onExecution: async ({ configVars, executionId, customer }, params) => {
    const openaiConnection = util.types.toString(
      configVars.OPENAI_API_KEY.fields.apiKey,
    );

    const input = parseFlowInput(params.onTrigger.results.body.data);

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

    const systemPrompt = `${configVars.SYSTEM_PROMPT}

You are an AI assistant with access to API operations and deployed customer integrations as tools.
Use these tools to help users accomplish their tasks efficiently.`;

    // Setup agent with both API tools and Prismatic tools
    const runner = await setupAgent({
      systemPrompt,
      openAIKey: openaiConnection,
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

    if (!input.message) {
      throw new Error("Message is required for integrations as tools");
    }

    await runner.run(
      input.message,
      input.conversationId,
      input.previousExecutionId,
    );

    return {
      data: buildFlowOutput(runner.storage.getLastSavedState(), executionId),
    };
  },
});

export default integrationsAsTools;
