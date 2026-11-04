import { flow, util } from "@prismatic-io/spectral";
import { Agent, run, setDefaultOpenAIKey, user } from "@openai/agents";
import agentTools from "../agents/tools/agents";
import { ChatRequest } from "../types";

export const agentAsTools = flow({
  name: "Agent as Tools",
  stableKey: "agent-as-tools",
  description:
    "Demonstrates using specialized agents as tools within a primary agent",
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

    // Create agent with specialized agent tools
    const agent = new Agent({
      name: "Orchestrator",
      instructions: `${configVars.SYSTEM_PROMPT}

Use the summarizer tool when requested by the user to summarize text.`,
      tools: [
        agentTools.summarizer, // Text summarization agent tool
      ],
    });

    // Get the message from the payload
    const { conversationId, message, lastResponseId } = params.onTrigger.results
      .body.data as ChatRequest;

    if (!message) {
      throw new Error("Message is required for agent tools");
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

export default agentAsTools;
