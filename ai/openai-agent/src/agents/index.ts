import {
  Agent,
  run,
  RunState,
  setDefaultOpenAIKey,
  AgentInputItem,
  Tool,
  user,
} from "@openai/agents";

import { AgentConfiguration } from "./types";
import { AgentState, StateStorage } from "./state";

/**
 * Cleans history items by removing undefined/null providerData fields
 * that can cause serialization issues with OpenAI
 */
function cleanHistory(history: AgentInputItem[]): AgentInputItem[] {
  return history.map((item) => {
    // Remove providerData if it's null or undefined
    if (
      "providerData" in item &&
      (item.providerData === null || item.providerData === undefined)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { providerData, ...cleanedItem } = item;
      return cleanedItem as AgentInputItem;
    }
    return item;
  });
}

export function createAgent(
  config?: AgentConfiguration,
): Agent<unknown, "text"> {
  if (!config?.openAIKey) {
    throw new Error("OPENAI_API_KEY not found, but required for agent");
  }
  setDefaultOpenAIKey(config.openAIKey);

  let tools: Tool[] = [];

  // Add any tools passed from the flow/config
  if (config.tools) {
    tools = tools.concat(config.tools);
  }

  const primaryAgent = new Agent({
    name: "Slack Assistant",
    instructions: `${config.systemPrompt}`,
    tools,
  });

  return primaryAgent;
}

export async function runAgent(
  agent: Agent,
  input: string,
  storage: StateStorage,
  conversationId?: string,
  previousExecutionId?: string,
): Promise<{
  finalOutput: string | null;
  agentState?: AgentState;
  needsApproval?: boolean;
}> {
  let history: AgentInputItem[] = [];

  // Load previous history if available
  if (conversationId && previousExecutionId) {
    const prevState = await storage.load(conversationId, previousExecutionId);
    if (prevState?.history) {
      history = prevState.history;
    }
  }

  // Add the new user message to history
  history.push(user(input));

  console.log(
    `[Agent] Running with conversationId: ${conversationId}, previousExecutionId: ${previousExecutionId}, History length: ${history.length}`,
  );

  // Run agent with history
  const result = await run(agent, history);
  // Check for interruptions (approval needed)
  if (result.interruptions && result.interruptions.length > 0) {
    const interruption = result.interruptions[0]; // Handle first interruption only
    console.log(
      `[Agent] Interruption detected: Tool '${interruption.rawItem.name}' needs approval`,
    );

    // Prepare state with interruption info
    const interruptedState: AgentState = {
      conversationId: conversationId || "default",
      history: cleanHistory(result.history),
      runState: result.state.toString(),
      metadata: {
        lastExecutionId: previousExecutionId,
        timestamp: Date.now(),
        interrupted: true,
      },
      pendingApproval: {
        toolName: interruption.rawItem.name,
        arguments: interruption.rawItem.arguments,
      },
    };

    if (conversationId) {
      await storage.save(interruptedState);
    }

    return {
      finalOutput: null,
      agentState: interruptedState,
      needsApproval: true,
    };
  }

  // Normal completion (no interruptions)
  const newState: AgentState = {
    conversationId: conversationId || "default",
    finalOutput: result.finalOutput,
    history: cleanHistory(result.history),
    // No runState needed for normal completion
    metadata: {
      lastExecutionId: previousExecutionId,
      timestamp: Date.now(),
      interrupted: false,
    },
  };

  if (conversationId) {
    await storage.save(newState);
  }
  return {
    finalOutput: result.finalOutput || null,
    agentState: newState,
    needsApproval: false,
  };
}

/**
 * Resume agent execution after an interruption (e.g., tool approval)
 * 
 * @param agent - The agent instance
 * @param storage - State storage implementation
 * @param conversationId - The conversation ID
 * @param previousExecutionId - The execution ID of the interrupted run
 * @param decision - The decision for the interruption (defaults to approved)
 */
export async function resumeAgentAfterInterruption(
  agent: Agent,
  storage: StateStorage,
  conversationId: string,
  previousExecutionId: string,
  decision: { approved: boolean; feedback?: string } = { approved: true },
): Promise<{
  finalOutput: string | null;
  agentState?: AgentState;
  needsApproval?: boolean;
}> {
  // Load the interrupted state
  const prevState = await storage.load(conversationId, previousExecutionId);

  if (!prevState?.runState) {
    console.error("[Agent] No interrupted state found for resumption");
    return {
      finalOutput: "Error: No pending approval found",
      needsApproval: false,
    };
  }

  console.log(
    `[Agent] Resuming with ${decision.approved ? "approval" : "denial"} for tool: ${prevState.pendingApproval?.toolName}`,
  );

  // Deserialize the RunState
  const state = await RunState.fromString(agent, prevState.runState);
  const interruptions = state.getInterruptions();

  // Apply the approval decision
  if (interruptions && interruptions.length > 0) {
    const interruption = interruptions[0];
    if (decision.approved) {
      state.approve(interruption);
    } else {
      state.reject(interruption);
    }
  }

  // Continue execution
  const result = await run(agent, state);

  // Check for more interruptions (in case there are multiple)
  if (result.interruptions && result.interruptions.length > 0) {
    const interruption = result.interruptions[0];
    console.log(
      `[Agent] Another interruption: Tool '${interruption.rawItem.name}' needs approval`,
    );

    const newState: AgentState = {
      conversationId,
      history: cleanHistory(result.history),
      runState: result.state.toString(),
      metadata: {
        timestamp: Date.now(),
        interrupted: true,
      },
      pendingApproval: {
        toolName: interruption.rawItem.name,
        arguments: interruption.rawItem.arguments,
      },
    };

    await storage.save(newState);

    return {
      finalOutput: null,
      agentState: newState,
      needsApproval: true,
    };
  }

  // Execution completed
  const newState: AgentState = {
    conversationId,
    finalOutput: result.finalOutput,
    history: cleanHistory(result.history),
    // No runState needed for normal completion
    metadata: {
      timestamp: Date.now(),
      interrupted: false,
    },
  };

  await storage.save(newState);

  return {
    finalOutput: result.finalOutput || null,
    agentState: newState,
    needsApproval: false,
  };
}

export default createAgent;
