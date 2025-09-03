import { flow, util } from "@prismatic-io/spectral";
import { Agent, run, setDefaultOpenAIKey, user } from "@openai/agents";
import { ChatRequest } from "../types";
import z from "zod";

export const structuredOutput = flow({
  name: "Structured Output",
  stableKey: "agent-structured-output",
  description:
    "Handles incoming messages and generates responses with a structured output based on JSON schema",
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
      outputType: z.object({
        response: z
          .string()
          .describe("The response to the users original question"),
        sentiment: z.string().describe("The sentiment of the users message"),
      }),
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
    if (!result.finalOutput) {
      throw new Error("An unexpected error occurred");
    }
    const { response, sentiment } = result.finalOutput;
    return {
      data: {
        response,
        sentiment,
        lastResponseId: result.lastResponseId,
        conversationId: conversationId,
      },
    };
  },
});

export default structuredOutput;
