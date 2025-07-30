/**
 * Shared utilities for chat scripts
 * Simple, functional approach for easy understanding and reuse
 */

import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { invokeFlow } from "@prismatic-io/spectral/dist/testing";
import { defaultTriggerPayload } from "@prismatic-io/spectral/dist/testing";
import { FlowOutput } from "../../src/types/flow.types";
import {
  createOrganizationClient,
  getIntegrationWithSystemInstance,
} from "../../src/prismatic";

// Suppress Node.js deprecation warnings
export function suppressWarnings() {
  process.removeAllListeners("warning");
  process.on("warning", (warning) => {
    if (warning.name !== "DeprecationWarning") {
      console.warn(warning);
    }
  });
}

// Configuration for a chat session
export interface ChatConfig {
  flow: any;                    // The flow to invoke (imported)
  flowName: string;             // Display name
  stableKey: string;            // For Prismatic mode
  description?: string;         // Optional description
  features?: string[];          // Optional feature list
  examplePrompts?: string[];    // Optional examples
  extraInfo?: string[];         // Optional extra information
}

/**
 * Main function to run a chat loop
 * Handles both local and Prismatic modes automatically
 */
export async function runChatLoop(config: ChatConfig): Promise<void> {
  suppressWarnings();
  
  // Determine mode
  const mode = process.env.PRISMATIC_REFRESH_TOKEN ? "prismatic" : "local";
  
  // Print header
  console.log(`🤖 ${config.flowName}\n`);
  console.log(`Mode: ${mode}`);
  console.log(`Flow: ${config.flow.name || config.stableKey}`);
  console.log(`----------------------------`);
  
  if (config.description) {
    console.log(config.description);
  }
  
  if (config.features && config.features.length > 0) {
    config.features.forEach(feature => console.log(feature));
  }
  
  if (config.extraInfo && config.extraInfo.length > 0) {
    config.extraInfo.forEach(info => console.log(info));
  }
  
  console.log(`----------------------------\n`);
  
  // Get webhook URL if in Prismatic mode
  let webhookUrl: string | null = null;
  if (mode === "prismatic") {
    webhookUrl = await getPrismaticWebhookUrl(config.stableKey);
    if (!webhookUrl) {
      return; // Error already logged in getPrismaticWebhookUrl
    }
  } else {
    // Check for OpenAI API key in local mode
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ Error: OPENAI_API_KEY environment variable is required");
      console.error("Please set it in your .env file or environment");
      process.exit(1);
    }
  }
  
  // Print examples if provided
  if (config.examplePrompts && config.examplePrompts.length > 0) {
    console.log("💡 Example prompts:");
    config.examplePrompts.forEach(prompt => console.log(`  - '${prompt}'`));
    console.log();
  }
  
  console.log("Type 'exit' to quit");
  console.log("Type 'clear' to start a new conversation\n");
  
  // Start conversation loop
  const rl = readline.createInterface({ input, output });
  const conversationId = `chat-${uuidv4()}`;
  let previousExecutionId: string | undefined;
  
  while (true) {
    const message = await rl.question("You: ");
    
    if (message.toLowerCase() === "exit") {
      console.log("\n👋 Goodbye!");
      break;
    }
    
    if (message.toLowerCase() === "clear") {
      previousExecutionId = undefined;
      console.log("\n🔄 Started new conversation\n");
      continue;
    }
    
    if (!message.trim()) {
      continue;
    }
    
    try {
      // Invoke the flow (local or prismatic)
      const result = mode === "local"
        ? await invokeLocal(config.flow, message, conversationId, previousExecutionId)
        : await invokePrismatic(webhookUrl!, message, conversationId, previousExecutionId);
      
      // Handle approval if needed
      if (result.agentState?.pendingApproval) {
        const approvalResult = await handleApproval(
          result.agentState.pendingApproval,
          config.flow,
          conversationId,
          result.executionId,
          mode,
          webhookUrl,
          rl
        );
        
        if (approvalResult.agentState?.finalOutput) {
          console.log(`Assistant: ${approvalResult.agentState.finalOutput}\n`);
        }
        previousExecutionId = approvalResult.executionId;
      } else {
        // Regular response
        if (result.agentState?.finalOutput) {
          console.log(`Assistant: ${result.agentState.finalOutput}\n`);
        } else {
          console.log("Assistant: (no response)\n");
        }
        previousExecutionId = result.executionId;
      }
    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}\n`);
    }
  }
  
  rl.close();
}

/**
 * Invoke a flow locally using Spectral testing utilities
 */
export async function invokeLocal(
  flow: any,
  message: string,
  conversationId: string,
  previousExecutionId?: string
): Promise<FlowOutput> {
  const configVars = {
    OPENAI_API_KEY: {
      fields: { apiKey: process.env.OPENAI_API_KEY },
    },
    SYSTEM_PROMPT: process.env.SYSTEM_PROMPT || "You are a helpful assistant.",
  };
  
  const payload = {
    ...defaultTriggerPayload(),
    body: {
      data: {
        conversationId,
        message,
        previousExecutionId,
      },
      contentType: "application/json",
    },
  };
  
  // Add execution logs for local mode
  console.log("\n---- Start Flow Execution ----");
  
  const { result } = await invokeFlow(flow, {
    configVars,
    payload,
  });
  
  console.log("---- End Flow Execution ----\n");
  
  return result?.data as FlowOutput;
}

/**
 * Invoke a flow via Prismatic webhook
 */
export async function invokePrismatic(
  webhookUrl: string,
  message: string,
  conversationId: string,
  previousExecutionId?: string
): Promise<FlowOutput> {
  const payload = {
    conversationId,
    message,
    previousExecutionId,
  };
  
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "prismatic-synchronous": "true",
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    throw new Error(`Webhook invocation failed: ${response.statusText}`);
  }
  
  return await response.json() as FlowOutput;
}

/**
 * Get webhook URL for a flow from Prismatic
 */
export async function getPrismaticWebhookUrl(stableKey: string): Promise<string | null> {
  // Check for integration ID file
  const prismJsonPath = ".spectral/prism.json";
  if (!fs.existsSync(prismJsonPath)) {
    console.error(
      "❌ Error: Integration not imported. Run 'npm run import' first to import the integration to Prismatic."
    );
    process.exit(1);
  }
  
  // Read integration ID
  const prismConfig = JSON.parse(fs.readFileSync(prismJsonPath, "utf-8"));
  const integrationId = prismConfig.integrationId;
  
  if (!integrationId) {
    console.error("❌ Error: No integrationId found in .spectral/prism.json");
    process.exit(1);
  }
  
  console.log(`Integration ID: ${integrationId}`);
  console.log("Fetching system instance details...\n");
  
  // Create Prismatic client
  const client = await createOrganizationClient(
    process.env.PRISMATIC_REFRESH_TOKEN!
  );
  
  // Get integration with system instance
  const integration = await getIntegrationWithSystemInstance(
    client,
    integrationId
  );
  
  if (!integration.instances?.nodes?.length) {
    console.error(
      "❌ Error: No system instance deployed for this integration. Deploy a system instance in Prismatic."
    );
    process.exit(1);
  }
  
  const systemInstance = integration.instances.nodes[0];
  console.log(`✅ Found system instance: ${systemInstance.name}`);
  
  // Find the flow by stableKey
  const flowConfig = systemInstance.flowConfigs.nodes.find(
    (fc) => fc.flow.stableKey === stableKey
  );
  
  if (!flowConfig) {
    console.error(
      `❌ Error: Flow with stableKey '${stableKey}' not found in system instance.`
    );
    process.exit(1);
  }
  
  console.log(`✅ Found flow: ${flowConfig.flow.name}`);
  console.log(`Webhook URL: ${flowConfig.webhookUrl}`);
  console.log("----------------------------\n");
  
  return flowConfig.webhookUrl;
}

/**
 * Handle approval prompts
 */
export async function handleApproval(
  needsApproval: any,
  flow: any,
  conversationId: string,
  previousExecutionId: string,
  mode: "local" | "prismatic",
  webhookUrl: string | null,
  rl: readline.Interface
): Promise<FlowOutput> {
  console.log(`\n⚠️  Tool requires approval: ${needsApproval.toolName}\n`);
  
  // Parse and display the approval details
  const args = typeof needsApproval.arguments === "string"
    ? JSON.parse(needsApproval.arguments)
    : needsApproval.arguments;
  
  displayApproval(needsApproval.toolName, args);
  
  // Ask for approval
  console.log(); // Empty line
  const approval = await rl.question("✅ Approve this action? (yes/no): ");
  const approved = approval.toLowerCase() === "yes" || approval.toLowerCase() === "y";
  
  // Send approval decision
  const approvalPayload = {
    conversationId,
    message: null,
    previousExecutionId,
    approval: {
      approved,
      feedback: approved ? undefined : "User denied the action",
    },
  };
  
  // Invoke with approval decision
  if (mode === "local") {
    const configVars = {
      OPENAI_API_KEY: {
        fields: { apiKey: process.env.OPENAI_API_KEY },
      },
      SYSTEM_PROMPT: process.env.SYSTEM_PROMPT || "You are a helpful assistant.",
    };
    
    const payload = {
      ...defaultTriggerPayload(),
      body: {
        data: approvalPayload,
        contentType: "application/json",
      },
    };
    
    console.log("\n---- Start Flow Execution (Approval) ----");
    
    const { result } = await invokeFlow(flow, {
      configVars,
      payload,
    });
    
    console.log("---- End Flow Execution (Approval) ----\n");
    
    return result?.data as FlowOutput;
  } else {
    // Prismatic mode
    const response = await fetch(webhookUrl!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "prismatic-synchronous": "true",
      },
      body: JSON.stringify(approvalPayload),
    });
    
    if (!response.ok) {
      throw new Error(`Webhook invocation failed: ${response.statusText}`);
    }
    
    return await response.json() as FlowOutput;
  }
}

/**
 * Display approval UI based on tool type
 */
export function displayApproval(toolName: string, args: any): void {
  // Custom display for specific tools
  if (toolName === "create_post") {
    console.log("📝 New Post to Create:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Title: ${args.title}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Body:");
    console.log(args.body);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } else if (toolName === "update_post") {
    console.log("✏️  Post Update Request:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Post ID: ${args.postId}`);
    console.log(`New Title: ${args.title}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("New Body:");
    console.log(args.body);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } else {
    // Generic display for other tools
    console.log("📋 Tool Arguments:");
    console.log(JSON.stringify(args, null, 2));
  }
}

/**
 * Handle cleanup on SIGINT
 */
export function setupCleanupHandler(): void {
  process.on("SIGINT", () => {
    console.log("\n\n👋 Goodbye!");
    process.exit(0);
  });
}