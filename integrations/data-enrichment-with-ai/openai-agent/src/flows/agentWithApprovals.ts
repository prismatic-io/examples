import { flow, util } from "@prismatic-io/spectral";
import {
  Agent,
  run,
  RunState,
  RunToolApprovalItem,
  setDefaultOpenAIKey,
  user,
} from "@openai/agents";
import apiTools from "../agents/tools/api";
import { ChatRequest, Interruption } from "../types";
export const approvalFlow = flow({
  name: "Approval Flow",
  stableKey: "api-agent-approvals",
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

        // Write tools
        apiTools.createPost, //needsApproval: true
        apiTools.updatePost, //needsApproval: true
      ],
    });

    // Get the message from the payload
    const {
      message,
      conversationId,
      lastResponseId,
      state,
      interruptions: userResponses,
    } = params.onTrigger.results.body.data as ChatRequest;

    if (userResponses && state) {
      let agentState = await RunState.fromString(agent, state);
      agentState = updateStateWithUserResponse(
        agentState,
        agentState.getInterruptions(),
        userResponses,
      );

      const result = await run(agent, agentState);
      const interruptions: Interruption[] = handleInterrupt(
        result.interruptions,
      );
      return {
        data: {
          response: interruptions.length > 0 ? undefined : result.finalOutput,
          interruptions,
          lastResponseId: result.lastResponseId,
          conversationId,
          state: result.state.toString(),
        },
      };
    } else {
      if (!message) {
        throw new Error("Message is required to run the agent");
      }

      // Run the agent with the message
      const result = await run(agent, [user(message)], {
        previousResponseId: lastResponseId,
      });

      const interruptions: Interruption[] = handleInterrupt(
        result.interruptions,
      );
      return {
        data: {
          response: interruptions.length > 0 ? undefined : result.finalOutput,
          interruptions,
          lastResponseId: result.lastResponseId,
          conversationId,
          state: result.state.toString(),
        },
      };
    }
  },
});

function updateStateWithUserResponse(
  state: RunState<unknown, Agent<unknown, "text">>,
  interrupts: RunToolApprovalItem[],
  userResponses: Interruption[],
) {
  for (const userResponse of userResponses) {
    const interrupt = interrupts.find(
      (i) => i.rawItem.id === userResponse.functionId,
    );
    if (interrupt) {
      if (userResponse.approved) {
        state.approve(interrupt);
      } else {
        state.reject(interrupt);
      }
    }
  }
  return state;
}

function handleInterrupt(interrupts: RunToolApprovalItem[]): Interruption[] {
  if (interrupts.length === 0) {
    return [];
  }
  const userApprovalItems = interrupts.map((intr) => ({
    functionId: intr.rawItem.id!,
    name: intr.rawItem.name,
    approved: false,
    arguments: intr.rawItem.arguments,
  }));
  return userApprovalItems;
}

export default approvalFlow;
