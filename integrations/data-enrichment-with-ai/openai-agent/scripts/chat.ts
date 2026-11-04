#!/usr/bin/env node

import { runChatLoop, setupCleanupHandler } from "./lib/chat-utils";
import { basicChat } from "../src/flows/basicChat";

// Setup cleanup handler
setupCleanupHandler();

// Run the chat loop with configuration
runChatLoop({
  flow: basicChat,
  flowName: "OpenAI Agent Chat Test",
  stableKey: "agent-basic-chat",
  description: "Basic conversational AI assistant",
}).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});