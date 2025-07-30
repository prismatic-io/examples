import { flow, util } from "@prismatic-io/spectral";
import { Agent, run, setDefaultOpenAIKey, user } from "@openai/agents";
import { ChatRequest } from "../types";

export const basicChat = flow({
  name: "Basic Chat",
  stableKey: "agent-basic-chat",
  description:
    "Handles incoming messages and generates responses with OpenAI Assistant SDK",
  isSynchronous: true,
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

    // Create a new agent with our system prompt
    const agent = new Agent({
      name: "Assistant",
      instructions: configVars.SYSTEM_PROMPT,
    });

    // Get the message from the payload
    const { message, conversationId, lastResponseId } = params.onTrigger.results
      .body.data as ChatRequest;
    if (!message) {
      throw new Error("Message is required for basic chat");
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

export default basicChat;
