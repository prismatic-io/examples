import {
  Agent,
  run,
  withTrace,
  setDefaultOpenAIKey,
  AgentInputItem,
} from "@openai/agents";

import { AgentConfiguration } from "../types/config.types";

export async function createAgent(
  config?: AgentConfiguration,
): Promise<Agent<unknown, "text">> {
  if (!config?.openAIKey) {
    throw new Error("OPENAI_API_KEY not found, but required for agent");
  }
  setDefaultOpenAIKey(config.openAIKey);

  const primaryAgent = new Agent({
    name: "Slack Assistant",
    instructions: `${config.systemPrompt}`,
  });

  return primaryAgent;
}

export async function runAgent(agent: Agent, input: AgentInputItem[] | string) {
  const result = await run(agent, input, { maxTurns: 10 });
  return result.finalOutput;
}

export async function runAgentWithDebug(
  agent: Agent,
  input: AgentInputItem[] | string,
) {
  const result = await withTrace("Agent Execution", async () => {
    const response = await run(agent, input, { maxTurns: 10 });

    for (const message of response.history) {
      if (message.type === "message") {
        console.log("[Message]: ", message.content);
      } else {
        if (message.type === "function_call_result") {
          console.log(
            "[Function Result]: ",
            message.output.type === "text"
              ? message.output.text
              : "<image output>",
          );
        }
      }
    }
    return response.finalOutput;
  });

  return result;
}

export default createAgent;