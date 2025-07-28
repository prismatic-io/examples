import { flow, util } from "@prismatic-io/spectral";
import { createAgent, runAgent } from "../agents";
import { AgentInputItem } from "@openai/agents";
import apiTools from "../agents/tools/api";

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
  onExecution: async ({ configVars }, params) => {
    const openaiConnection = util.types.toString(
      configVars.OPENAI_API_KEY.fields.apiKey,
    );

    const incomingMessage = params.onTrigger.results.body.data as { messages: { role: string, content: string }[] }

    const systemPrompt = `${configVars.SYSTEM_PROMPT}

You are an API assistant that can help users interact with their data. You have access to the following tools:
- get_current_user_info: Get information about the currently logged in user
- get_users_posts: Get all posts from the current user
- get_post: Get a specific post by its ID
- create_post: Create a new post with a title and body
- update_post: Update an existing post's title and body
- get_post_comments: Get all comments for a specific post

Use these tools to help users manage their posts and access their data.`;

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

    const result = await runAgent(agent, incomingMessage.messages as AgentInputItem[]);

    return {
      data: result
    };
  },
});

export default apiAgent;