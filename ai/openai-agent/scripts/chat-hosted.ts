#!/usr/bin/env node

import { runChatLoop, setupCleanupHandler } from "./lib/chat-utils";
import { hostedTools } from "../src/flows/hostedTools";

// Setup cleanup handler
setupCleanupHandler();

// Run the chat loop with configuration
runChatLoop({
  flow: hostedTools,
  flowName: "OpenAI Agent Chat Test - Hosted Tools",
  stableKey: "hosted-tools",
  description: "This flow uses OpenAI's hosted tools.",
  features: [
    "Available hosted tools:",
    "  • web_search - Search the web for information",
    "  • Other OpenAI-provided tools",
  ],
  examplePrompts: [
    "Search for the latest news about AI",
    "What's the weather like today?",
    "Find information about TypeScript best practices",
  ],
}).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});