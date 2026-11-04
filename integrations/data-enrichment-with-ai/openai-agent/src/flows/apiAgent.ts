import { flow, util } from "@prismatic-io/spectral";
import { Agent, run, setDefaultOpenAIKey, user } from "@openai/agents";
import apiTools from "../agents/tools/api";
import { ChatRequest, ChatResponse } from "../types";
export const apiAgent = flow({
  name: "API Agent",
  stableKey: "api-agent",
  description: "Demonstrates wrapping REST APIs as AI tools for interaction",
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

    // Create agent with API tools
    const agent = new Agent({
      name: "API Assistant",
      instructions: `${configVars.SYSTEM_PROMPT}

You are an API assistant that helps users interact with their data.
Use the available tools to fulfill user requests.`,
      tools: [
        // Read-only tools
        apiTools.getCurrentUserInfo,
        apiTools.getPosts,
        apiTools.getPost,
        apiTools.getPostComments,
      ],
    });

    // Get the message from the payload
    const { message, conversationId, lastResponseId } = params.onTrigger.results
      .body.data as ChatRequest;

    if (!message) {
      throw new Error("Message is required for API agent");
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

export default apiAgent;
