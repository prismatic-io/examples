#!/usr/bin/env node

import { runChatLoop, setupCleanupHandler } from "./lib/chat-utils";
import { approvalFlow } from "../src/flows/agentWithApprovals";

// Setup cleanup handler
setupCleanupHandler();

// Run the chat loop with configuration
runChatLoop({
  flow: approvalFlow,
  flowName: "Approval Flow",
  stableKey: "API-Agent-Approval-Flow",
  description:
    "Chat with an agent that requires approval for sensitive tool execution",
  features: [
    "Available tools:",
    "  • get_current_user_info",
    "  • get_users_posts",
    "  • get_post",
    "  • create_post (requires approval)",
    "  • update_post (requires approval)",
    "  • get_post_comments",
  ],
  examplePrompts: [
    "Get my user info",
    "Show me all my posts",
    "Create a new post about TypeScript",
    "Get comments for post 1",
  ],
}).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
