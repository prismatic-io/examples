import { flow, util } from "@prismatic-io/spectral";
import { createAgent, runAgentWithApproval } from "../agents";
import { AgentInputItem } from "@openai/agents";
import apiTools from "../agents/tools/api";

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
  onExecution: async ({ configVars }, params) => {
    const openaiConnection = util.types.toString(
      configVars.OPENAI_API_KEY.fields.apiKey,
    );

    const incomingData = params.onTrigger.results.body.data as {
      messages?: { role: string; content: string }[];
      state?: string;
      toolApprovals?: Array<{
        callId: string;
        decision: 'approved' | 'rejected';
        reason?: string;
      }>;
    };

    const systemPrompt = `${configVars.SYSTEM_PROMPT}

You are an API assistant that helps users interact with their data.

IMPORTANT: You MUST use the available tools to fulfill user requests. Do not just describe what you would do - actually use the tools.

Available tools:
- get_current_user_info: Get information about the currently logged in user
- get_users_posts: Get all posts from the current user
- get_post: Get a specific post by its ID
- create_post: Create a new post with a title and body
- update_post: Update an existing post's title and body
- get_post_comments: Get all comments for a specific post

When a user asks you to create or update a post, use the appropriate tool immediately. Do not ask for confirmation - the system will handle approval if needed.`;

    const agent = await createAgent({
      systemPrompt,
      openAIKey: openaiConnection,
      tools: [
        apiTools.getCurrentUserInfo,
        apiTools.getPosts,
        apiTools.getPost,
        apiTools.createPost,
        apiTools.updatePost,
        apiTools.getPostComments,
      ]
    });

    // Prepare messages - either from request or empty array for resume
    const messages = (incomingData.messages || []) as AgentInputItem[];

    // Run agent with approval handling
    const result = await runAgentWithApproval(
      agent,
      messages,
      incomingData.state && incomingData.toolApprovals
        ? {
          serializedState: incomingData.state,
          toolApprovals: incomingData.toolApprovals,
        }
        : undefined
    );
    // console.log(JSON.stringify(result, null, 2))
    return {
      data: result
    };
  },
});

export default humanApprovalFlow;