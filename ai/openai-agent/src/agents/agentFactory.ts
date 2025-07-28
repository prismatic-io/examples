import {
  Agent,
  run,
  withTrace,
  setDefaultOpenAIKey,
  AgentInputItem,
  RunState,
} from "@openai/agents";

import { AgentConfiguration } from "../types/config.types";

export async function createAgent(
  config?: AgentConfiguration,
): Promise<Agent<unknown, "text">> {
  if (!config?.openAIKey) {
    throw new Error("OPENAI_API_KEY not found, but required for agent");
  }
  setDefaultOpenAIKey(config.openAIKey);

  const agent = new Agent({
    name: "AI Agent",
    instructions: `${config.systemPrompt}`,
    tools: config.tools,
  });

  return agent;
}

export async function runAgent(agent: Agent, input: AgentInputItem[] | string) {
  const result = await run(agent, input, { maxTurns: 10 });
  return { response: result.finalOutput, history: result.history };
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

export type ToolApproval = {
  callId: string;
  decision: 'approved' | 'rejected';
  reason?: string;
};

export type PendingApproval = {
  callId: string;
  toolName: string;
  arguments: any;
  agentName: string;
};

export type ApprovalResult = {
  needsApproval: boolean;
  response?: string;
  state?: string;
  pendingApprovals?: PendingApproval[];
  history: any[];
};

export async function runAgentWithApproval(
  agent: Agent,
  messages: AgentInputItem[],
  resumeState?: {
    serializedState: string;
    toolApprovals: ToolApproval[];
  }
): Promise<ApprovalResult> {
  let result;

  if (resumeState) {
    // Restore state and process approvals
    const state = await RunState.fromString(agent, resumeState.serializedState);

    // Create approval map for quick lookup
    const approvalMap = new Map(
      resumeState.toolApprovals.map(approval => [approval.callId, approval])
    );

    // Get current interruptions from the state
    const tempResult = await run(agent, state, { maxTurns: 0 });

    // Process each interruption
    for (const interruption of tempResult.interruptions || []) {
      const callId = (interruption.rawItem as any).callId || (interruption.rawItem as any).id;
      const approval = approvalMap.get(callId);

      if (!approval) {
        state.reject(interruption);
      } else if (approval.decision === 'approved') {
        state.approve(interruption);
      } else {
        state.reject(interruption);
      }
    }

    // Continue execution with processed approvals
    result = await run(agent, state);
  } else {
    // Initial execution
    result = await run(agent, messages, { maxTurns: 10 });
  }
  
  // Check if there are interruptions that need approval
  if (result.interruptions && result.interruptions.length > 0) {
    // Return formatted response for approval UI
    return {
      needsApproval: true,
      state: JSON.stringify(result.state),
      pendingApprovals: result.interruptions.map(interruption => ({
        callId: (interruption.rawItem as any).callId || (interruption.rawItem as any).id || '',
        toolName: (interruption.rawItem as any).name,
        arguments: JSON.parse((interruption.rawItem as any).arguments || '{}'),
        agentName: interruption.agent.name
      })),
      history: result.history
    };
  }

  // Normal completion
  return {
    needsApproval: false,
    response: result.finalOutput,
    history: result.history
  };
}

export default createAgent;
