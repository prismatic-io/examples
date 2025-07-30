import { flow, util } from "@prismatic-io/spectral";
import { createAgent, runAgent } from "../agents";
import { AgentInputItem } from "@openai/agents";

import toolAgents from "../agents/tools/agents";

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
  onExecution: async ({ configVars }, params) => {
    const openaiConnection = util.types.toString(
      configVars.OPENAI_API_KEY.fields.apiKey,
    );

    const incomingMessage = params.onTrigger.results.body.data as { messages: { role: string, content: string }[] }

    const summarizerTool = toolAgents.summarizer
    const agent = await createAgent({
      systemPrompt: `${configVars.SYSTEM_PROMPT} \n Use the summarizer tool to when requested by the user to summarize text`,
      openAIKey: openaiConnection,
      tools: [summarizerTool]
    })

    const result = await runAgent(agent, incomingMessage.messages as AgentInputItem[])

    return {
      data: result
    };
  },
});

export default agentAsTools;
