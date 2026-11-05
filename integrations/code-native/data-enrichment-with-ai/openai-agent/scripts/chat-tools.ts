#!/usr/bin/env node

import { agentAsTools } from "../src/flows/agentAsTools";
import { runChatLoop, setupCleanupHandler } from "./lib/chat-utils";

// Setup cleanup handler
setupCleanupHandler();

// Run the chat loop with configuration
runChatLoop({
  flow: agentAsTools,
  flowName: "OpenAI Agent Chat Test - Agent as Tools",
  stableKey: "Agent-as-Tools",
  description: "This flow demonstrates using specialized agents as tools.",
  features: ["Available agent tools:", "  • summarizer - Text summarization agent"],
  examplePrompts: [
    "Summarize this text: [paste long text]",
    "Give me a summary of the following article...",
  ],
}).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
