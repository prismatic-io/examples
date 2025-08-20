import { flow, util } from "@prismatic-io/spectral";
import { setupAgent } from "../agents/setup";
import apiTools from "../agents/tools/api";
import { parseFlowInput, buildFlowOutput, isApprovalInput } from "./utils/flowHelpers";

export const apiAgent = flow({
  name: "API Agent",
  stableKey: "API-Agent",
  description:
    "Handles incoming messages and provides API interactions through an AI agent",
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

You are an API assistant that can help users interact with their data.
Use these tools to help users manage their posts and access their data.`;

    // Setup agent with all API tools for data management
    const runner = await setupAgent({
      systemPrompt,
      openAIKey: openaiConnection,
      tools: [
        apiTools.getCurrentUserInfo, // Get current user information
        apiTools.getPosts, // Get all posts from current user
        apiTools.getPost, // Get a specific post by ID
        apiTools.createPost, // Create new post (requires approval)
        apiTools.updatePost, // Update existing post (requires approval)
        apiTools.getPostComments, // Get comments for a post
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

export default apiAgent;
