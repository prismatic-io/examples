#!/usr/bin/env node

import { runChatLoop, setupCleanupHandler } from "./lib/chat-utils";
import { integrationsAsTools } from "../src/flows/integrationsAsTools";

// Setup cleanup handler
setupCleanupHandler();

// Check customer external ID
const customerExternalId = process.env.CUSTOMER_EXTERNAL_ID;
const extraInfo: string[] = [];

if (customerExternalId) {
  extraInfo.push(`✅ Customer External ID: ${customerExternalId}`);
  extraInfo.push(`   Integration tools will be loaded dynamically.`);
} else {
  extraInfo.push(`⚠️  No CUSTOMER_EXTERNAL_ID set.`);
  extraInfo.push(`   Only API tools will be available.`);
  extraInfo.push(`   Set CUSTOMER_EXTERNAL_ID to enable integration tools.`);
}

// Example prompts vary based on configuration
const examplePrompts = [
  "What tools do you have available?",
  "Get my user info",
  "Show me all my posts",
];

if (customerExternalId) {
  examplePrompts.push("Run the [integration name]");
}

// Run the chat loop with configuration
runChatLoop({
  flow: integrationsAsTools,
  flowName: "OpenAI Agent Chat Test - Integrations as Tools",
  stableKey: "integrations-as-tools",
  description: "This flow combines API tools with deployed integrations.",
  extraInfo,
  examplePrompts,
}).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
