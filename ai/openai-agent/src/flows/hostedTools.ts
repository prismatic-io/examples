import { flow, util } from "@prismatic-io/spectral";
import { setupAgent } from "../agents/setup";
import { createHostedTools } from "../agents/tools/openaiHostedTools";
import { parseFlowInput, buildFlowOutput } from "./utils/flowHelpers";

export const hostedTools = flow({
  name: "Agent Chat Handler",
  stableKey: "Agent-Chat-Handler",
  description:
    "Handles incoming messages and generates responses with OpenAI Assistant SDK",
  onTrigger: async (context, payload) => {
    return Promise.resolve({
      payload,
    });
  },
  onExecution: async ({ configVars, executionId }, params) => {
    const openaiConnection = util.types.toString(
      configVars.OPENAI_API_KEY.fields.apiKey,
    );

    const input = parseFlowInput(params.onTrigger.results.body.data);

    // Setup agent with OpenAI's hosted tools
    // These are tools that OpenAI provides and hosts (e.g., web_search)
    const runner = await setupAgent({
      systemPrompt: configVars.SYSTEM_PROMPT,
      openAIKey: openaiConnection,
      tools: createHostedTools(),  // Returns array of OpenAI-hosted tools like web_search
    });

    if (!input.message) {
      throw new Error("Message is required for hosted tools");
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

export default hostedTools;
