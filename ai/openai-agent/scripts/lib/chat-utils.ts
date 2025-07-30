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
import {
  createOrganizationClient,
  getIntegrationWithSystemInstance,
} from "../../src/prismatic";
import { ChatRequest, ChatResponse, Interruption } from "../../src/types";
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
  flow: any; // The flow to invoke (imported)
  flowName: string; // Display name
  stableKey: string; // For Prismatic mode
  description?: string; // Optional description
  features?: string[]; // Optional feature list
  examplePrompts?: string[]; // Optional examples
  extraInfo?: string[]; // Optional extra information
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
    config.features.forEach((feature) => console.log(feature));
  }

  if (config.extraInfo && config.extraInfo.length > 0) {
    config.extraInfo.forEach((info) => console.log(info));
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
      console.error(
        "❌ Error: OPENAI_API_KEY environment variable is required",
      );
      console.error("Please set it in your .env file or environment");
      process.exit(1);
    }
  }

  // Print examples if provided
  if (config.examplePrompts && config.examplePrompts.length > 0) {
    console.log("💡 Example prompts:");
    config.examplePrompts.forEach((prompt) => console.log(`  - '${prompt}'`));
    console.log();
  }

  console.log("Type 'exit' to quit");
  console.log("Type 'clear' to start a new conversation\n");

  // Start conversation loop
  const rl = readline.createInterface({ input, output });
  const conversationId = `chat-${uuidv4()}`;
  let lastResponseId: string | undefined;
  let currentState: string | undefined;

  while (true) {
    const message = await rl.question("You: ");

    if (message.toLowerCase() === "exit") {
      console.log("\n👋 Goodbye!");
      break;
    }

    if (message.toLowerCase() === "clear") {
      lastResponseId = undefined;
      currentState = undefined;
      console.log("\n🔄 Started new conversation\n");
      continue;
    }

    if (!message.trim()) {
      continue;
    }

    try {
      // Invoke the flow (local or prismatic)
      const result =
        mode === "local"
          ? await invokeLocal(
              config.flow,
              message,
              conversationId,
              lastResponseId,
              currentState,
            )
          : await invokePrismatic(
              webhookUrl!,
              message,
              conversationId,
              lastResponseId,
              currentState,
            );

      // Handle interruptions if present
      if (
        result.interruptions &&
        result.interruptions.length > 0 &&
        result.state
      ) {
        const approvalResult = await handleInterruptions(
          result.interruptions,
          result.state,
          config.flow,
          conversationId,
          result.lastResponseId,
          mode,
          webhookUrl,
          rl,
        );

        // Handle the result after approvals
        if (
          approvalResult.interruptions &&
          approvalResult.interruptions.length > 0
        ) {
          // More approvals needed
          console.log("Additional approvals required. Continuing...\n");
          lastResponseId = approvalResult.lastResponseId;
          currentState = approvalResult.state;
        } else if (approvalResult.response) {
          // Final response received
          console.log(`Assistant: ${approvalResult.response}\n`);
          lastResponseId = approvalResult.lastResponseId;
          currentState = approvalResult.state;
        } else {
          console.log("Assistant: (no response)\n");
          lastResponseId = approvalResult.lastResponseId;
          currentState = approvalResult.state;
        }
      } else {
        // Regular response without interruptions
        if (result.response) {
          console.log(`Assistant: ${result.response}\n`);
        } else {
          console.log("Assistant: (no response)\n");
        }
        lastResponseId = result.lastResponseId;
        currentState = result.state;
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
  message: string | null,
  conversationId: string,
  lastResponseId?: string,
  state?: string,
  interruptions?: Interruption[],
): Promise<ChatResponse> {
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
        lastResponseId,
        state,
        interruptions,
      } as ChatRequest,
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

  return result?.data as ChatResponse;
}

/**
 * Invoke a flow via Prismatic webhook
 */
export async function invokePrismatic(
  webhookUrl: string,
  message: string | null,
  conversationId: string,
  lastResponseId?: string,
  state?: string,
  interruptions?: Interruption[],
): Promise<ChatResponse> {
  const payload: ChatRequest = {
    conversationId,
    message,
    lastResponseId,
    state,
    interruptions,
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

  return (await response.json()) as ChatResponse;
}

/**
 * Get webhook URL for a flow from Prismatic
 */
export async function getPrismaticWebhookUrl(
  stableKey: string,
): Promise<string | null> {
  // Check for integration ID file
  const prismJsonPath = ".spectral/prism.json";
  if (!fs.existsSync(prismJsonPath)) {
    console.error(
      "❌ Error: Integration not imported. Run 'npm run import' first to import the integration to Prismatic.",
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
    process.env.PRISMATIC_REFRESH_TOKEN!,
  );

  // Get integration with system instance
  const integration = await getIntegrationWithSystemInstance(
    client,
    integrationId,
  );

  if (!integration.instances?.nodes?.length) {
    console.error(
      "❌ Error: No system instance deployed for this integration. Deploy a system instance in Prismatic.",
    );
    process.exit(1);
  }

  const systemInstance = integration.instances.nodes[0];
  console.log(`✅ Found system instance: ${systemInstance.name}`);

  // Find the flow by stableKey
  const flowConfig = systemInstance.flowConfigs.nodes.find(
    (fc) => fc.flow.stableKey === stableKey,
  );

  if (!flowConfig) {
    console.error(
      `❌ Error: Flow with stableKey '${stableKey}' not found in system instance.`,
    );
    process.exit(1);
  }

  console.log(`✅ Found flow: ${flowConfig.flow.name}`);
  console.log(`Webhook URL: ${flowConfig.webhookUrl}`);
  console.log("----------------------------\n");

  return flowConfig.webhookUrl;
}

/**
 * Handle interruptions (approvals)
 */
export async function handleInterruptions(
  interruptions: Interruption[],
  state: string,
  flow: any,
  conversationId: string,
  lastResponseId: string,
  mode: "local" | "prismatic",
  webhookUrl: string | null,
  rl: readline.Interface,
): Promise<ChatResponse> {
  console.log(`\n⚠️  ${interruptions.length} tool(s) require approval:\n`);

  // Process each interruption
  const approvedInterruptions: Interruption[] = [];

  for (const interruption of interruptions) {
    // Pass raw arguments to displayApproval for handling
    displayApproval(interruption.name, interruption.arguments);

    // Ask for approval
    console.log(); // Empty line
    const approval = await rl.question(
      `✅ Approve ${interruption.name}? (yes/no): `,
    );
    const approved =
      approval.toLowerCase() === "yes" || approval.toLowerCase() === "y";

    approvedInterruptions.push({
      ...interruption,
      approved,
    });

    console.log(approved ? "✓ Approved" : "✗ Rejected");
    console.log(); // Empty line
  }

  // Invoke with approval decisions (no message, just interruptions and state)
  if (mode === "local") {
    return await invokeLocal(
      flow,
      null, // No message when resuming
      conversationId,
      lastResponseId,
      state,
      approvedInterruptions,
    );
  } else {
    return await invokePrismatic(
      webhookUrl!,
      null, // No message when resuming
      conversationId,
      lastResponseId,
      state,
      approvedInterruptions,
    );
  }
}

/**
 * Display approval UI for tool calls
 */
export function displayApproval(toolName: string, rawArgs: any): void {
  console.log(`\n📋 Tool: ${toolName}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Parse and display arguments
  let displayContent: string;

  const parsed = JSON.parse(rawArgs);
  displayContent = Object.entries(parsed)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  console.log("Arguments:");
  console.log(displayContent);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
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
