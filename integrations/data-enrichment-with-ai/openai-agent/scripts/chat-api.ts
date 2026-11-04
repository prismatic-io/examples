#!/usr/bin/env node

import { runChatLoop, setupCleanupHandler } from "./lib/chat-utils";
import { apiAgent } from "../src/flows/apiAgent";

// Setup cleanup handler
setupCleanupHandler();

// Run the chat loop with configuration
runChatLoop({
  flow: apiAgent,
  flowName: "OpenAI Agent Chat Test - API Tools",
  stableKey: "API-Agent",
  description: "API tools for interacting with data",
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