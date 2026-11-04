#!/usr/bin/env node

import { runChatLoop, setupCleanupHandler } from "./lib/chat-utils";
import { agentRouting } from "../src/flows/agentRouting";

// Setup cleanup handler
setupCleanupHandler();

// Run the chat loop with configuration
runChatLoop({
  flow: agentRouting,
  flowName: "OpenAI Agent Chat Test - Agent Routing",
  stableKey: "agent-routing",
  description: "This flow demonstrates agent handoff patterns.",
  features: [
    "Specialized agents:",
    "  • Triage Agent - Routes to appropriate specialist",
    "  • Order Lookup Agent - Handles order inquiries",
    "  • Support Agent - Creates support tickets",
  ],
  examplePrompts: [
    "Where is my order ORD-12345?",
    "I have a problem with my order",
    "Check order ORD-67890",
    "I need help with a refund",
  ],
  extraInfo: [
    "",
    "📦 Available test orders:",
    "  - ORD-12345 (shipped)",
    "  - ORD-67890 (processing)",
    "  - ORD-11111 (delivered)",
  ],
}).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});