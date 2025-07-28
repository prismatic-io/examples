import { flow, util } from "@prismatic-io/spectral";
import { createAgent, runAgent } from "../agents";
import { AgentInputItem } from "@openai/agents";
import openAiHostedTools from "../agents/tools/hosted";

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
  onExecution: async ({ configVars }, params) => {
    const openaiConnection = util.types.toString(
      configVars.OPENAI_API_KEY.fields.apiKey,
    );

    const incomingMessage = params.onTrigger.results.body.data as { messages: { role: string, content: string }[] }

    // Setup OpenAI hosted tools like web search and code interpreter
    const tools = openAiHostedTools();

    const agent = await createAgent({ systemPrompt: configVars.SYSTEM_PROMPT, openAIKey: openaiConnection, tools })
    const result = await runAgent(agent, incomingMessage.messages as AgentInputItem[])

    return {
      data: result
    };
  },
});

export default hostedTools;
