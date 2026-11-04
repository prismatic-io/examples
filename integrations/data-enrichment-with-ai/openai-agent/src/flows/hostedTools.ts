import { flow, util } from "@prismatic-io/spectral";
import { Agent, run, setDefaultOpenAIKey, user } from "@openai/agents";
import { createHostedTools } from "../agents/tools/openaiHostedTools";
import { ChatRequest } from "../types";

export const hostedTools = flow({
  name: "Hosted Tools",
  stableKey: "hosted-tools",
  description: "Demonstrates using OpenAI's hosted tools like web search",
  onTrigger: async (context, payload) => {
    return Promise.resolve({
      payload,
    });
  },
  onExecution: async ({ configVars }, params) => {
    const openaiKey = util.types.toString(
      configVars.OPENAI_API_KEY.fields.apiKey,
    );

    // Set the OpenAI API key
    setDefaultOpenAIKey(openaiKey);

    // Create agent with OpenAI's hosted tools
    const agent = new Agent({
      name: "Research Assistant",
      instructions: configVars.SYSTEM_PROMPT,
      tools: createHostedTools(), // Returns array of OpenAI-hosted tools like web_search
    });

    // Get the message from the payload
    const { message, conversationId, lastResponseId } = params.onTrigger.results
      .body.data as ChatRequest;

    if (!message) {
      throw new Error("Message is required for hosted tools");
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
        conversationId: conversationId,
      },
    };
  },
});

export default hostedTools;
