import { flow, util } from "@prismatic-io/spectral";
import { setupAgent } from "../agents/setup";
import agentTools from "../agents/tools/agents";
import { parseFlowInput, buildFlowOutput } from "./utils/flowHelpers";

export const agentAsTools = flow({
  name: "Agent as Tools",
  stableKey: "Agent-as-Tools",
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

    // Setup agent with specialized agent tools
    // These are helper agents that can be called as tools
    const runner = await setupAgent({
      systemPrompt: `${configVars.SYSTEM_PROMPT} \n Use the summarizer tool when requested by the user to summarize text`,
      openAIKey: openaiConnection,
      tools: [
        agentTools.summarizer,  // Text summarization agent tool
      ],
    });

    if (!input.message) {
      throw new Error("Message is required for agent tools");
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

export default agentAsTools;
