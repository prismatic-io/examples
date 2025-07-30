import { flow, util } from "@prismatic-io/spectral";
import { createAgent, runAgent } from "../agents";
import { AgentInputItem } from "@openai/agents";

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
  onExecution: async ({ configVars }, params) => {
    const openaiConnection = util.types.toString(
      configVars.OPENAI_API_KEY.fields.apiKey,
    );

    const incomingMessage = params.onTrigger.results.body.data as { messages: { role: string, content: string }[] }
    const agent = await createAgent({ systemPrompt: configVars.SYSTEM_PROMPT, openAIKey: openaiConnection })
    const result = await runAgent(agent, incomingMessage.messages as AgentInputItem[])

    return {
      data: result
    };
  },
});

export default basicChat;
