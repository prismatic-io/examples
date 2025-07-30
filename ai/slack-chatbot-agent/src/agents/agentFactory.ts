import {
  Agent,
  run,
  withTrace,
  setDefaultOpenAIKey,
  AgentInputItem,
  Tool,
} from "@openai/agents";

import prismaticSearch from "./tools/webSearch";
import { AgentConfiguration } from "../types/config.types";
import { setupPrismaticTools } from "./tools/prismaticIntegrations";

export async function createAgent(
  config?: AgentConfiguration,
): Promise<Agent<unknown, "text">> {
  if (!config?.openAIKey) {
    throw new Error("OPENAI_API_KEY not found, but required for agent");
  }
  setDefaultOpenAIKey(config.openAIKey);

  let tools: Tool[] = [];
  console.log(
    config.prismaticSigningKey,
    config.customerProfile,
    config.prismaticSigningKey && config.customerProfile,
  );
  if (config.prismaticSigningKey && config.customerProfile) {
    console.log(
      "[Agent] Setting up Prismatic tools for Customer ",
      config.customerProfile.externalId,
    );
    const integrationTools = await setupPrismaticTools(
      config.prismaticSigningKey,
      {
        customer: config.customerProfile.externalId!,
        sub: `slack_agent_session_${config.customerProfile.externalId}`,
        organization:
          "T3JnYW5pemF0aW9uOmQ0NmUzNjA4LTI2ZmEtNDVhNy05YWRjLWE1ODZkYmYzODk1Yw==",
      },
    );
    tools = tools.concat(integrationTools);
  }
  if (config.tavilyKey) {
    tools.push(prismaticSearch({ TAVILY_API_KEY: config?.tavilyKey }));
  }
  console.log(
    "[Agent] Setting up agent with tools: ",
    JSON.stringify(tools, undefined, 2),
  );
  const primaryAgent = new Agent({
    name: "Slack Assistant",
    instructions: `${config.systemPrompt}`,
    tools,
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
