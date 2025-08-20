import { flow, util } from "@prismatic-io/spectral";
import { setupAgent } from "../agents/setup";
import { parseFlowInput, buildFlowOutput } from "./utils/flowHelpers";

export const basicChat = flow({
  name: "Basic Chat",
  stableKey: "agent-basic-chat",
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

    // Setup agent with no tools - pure conversation
    // This flow demonstrates a basic chat agent without any tool capabilities
    const runner = await setupAgent({
      systemPrompt: configVars.SYSTEM_PROMPT,
      openAIKey: openaiConnection,
      tools: [], // Explicitly no tools - just conversation
    });

    if (!input.message) {
      throw new Error("Message is required for basic chat");
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

export default basicChat;
