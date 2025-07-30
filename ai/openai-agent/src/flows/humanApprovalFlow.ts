import { flow, util } from "@prismatic-io/spectral";
import { setupAgent } from "../agents/setup";
import apiTools from "../agents/tools/api";
import { parseFlowInput, buildFlowOutput, isApprovalInput } from "./utils/flowHelpers";

export const humanApprovalFlow = flow({
  name: "Human Approval Flow",
  stableKey: "human-approval-flow",
  description:
    "Demonstrates human-in-the-loop approval process for sensitive API operations",
  isSynchronous: true,
  onTrigger: async (context, payload) => {
    return Promise.resolve({
      payload,
    });
  },
  onExecution: async ({ configVars, executionId }, params) => {
    const openaiConnection = util.types.toString(
      configVars.OPENAI_API_KEY.fields.apiKey,
    );

    const input = parseFlowInput(params.onTrigger.results.body.data);

    const systemPrompt = `${configVars.SYSTEM_PROMPT}

You are an API assistant that helps users interact with their data.

IMPORTANT: You MUST use the available tools to fulfill user requests. Do not just describe what you would do - actually use the tools.

When a user asks you to create or update a post, use the appropriate tool immediately. Do not ask for confirmation - the system will handle approval if needed.`;

    // Setup agent with explicit API tools
    // This demonstrates the approval flow - create_post and update_post require human approval
    const runner = await setupAgent({
      systemPrompt,
      openAIKey: openaiConnection,
      tools: [
        // Read-only tools (no approval needed)
        apiTools.getCurrentUserInfo,
        apiTools.getPosts,
        apiTools.getPost,
        apiTools.getPostComments,
        
        // Write tools (require approval - see needsApproval: true in tools/api.ts)
        apiTools.createPost,
        apiTools.updatePost,
      ],
    });

    if (isApprovalInput(input) && input.previousExecutionId) {
      // Resume with approval decision
      await runner.resume(
        input.conversationId,
        input.previousExecutionId,
        input.approval,
      );
    } else if (input.message) {
      // New message
      await runner.run(
        input.message,
        input.conversationId,
        input.previousExecutionId,
      );
    } else {
      throw new Error("Either 'message' or approval decision required");
    }
    
    return {
      data: buildFlowOutput(runner.storage.getLastSavedState(), executionId),
    };
  },
});

export default humanApprovalFlow;
