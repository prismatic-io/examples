import { Tool, tool } from "@openai/agents";
import { FlowConfig } from "../../prismatic/types";
import { invokeFlow } from "../../prismatic/api";
import { z } from "zod";

/**
 * Create OpenAI agent tools from Prismatic flows
 * @param flows - Array of flow configurations
 * @returns Array of OpenAI agent tool definitions
 */
export function createFlowTools(flows: FlowConfig[]): Tool[] {
  return flows.map((flow) =>
    tool({
      name: flow.name.replace(/\s+/g, "_").toLowerCase(),
      strict: false,
      description:
        flow.description || `Execute the ${flow.name} Prismatic flow`,
      parameters: flow.inputSchema || {
        type: "object",
        properties: {},
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async execute(args: any) {
        return await invokeFlow(flow, args);
      },
    }),
  );
}

/**
 * Test tool that requires human approval before execution
 */
export const deployTool = tool({
  name: "deploy_to_production",
  description: "Deploy code to production environment. Requires approval.",
  parameters: z.object({
    version: z.string().describe("Version to deploy (e.g., v1.2.3)"),
    environment: z
      .enum(["staging", "production"])
      .describe("Target environment"),
  }),
  needsApproval: true, // Always requires approval
  execute: async ({ version, environment }) => {
    // Mock deployment logic
    console.log(`[Deploy Tool] Deploying ${version} to ${environment}`);

    // Simulate deployment time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return `✅ Successfully deployed version ${version} to ${environment} environment`;
  },
});

/**
 * Get the approval tools for testing human in the loop
 */
export function getApprovalTools() {
  return [deployTool];
}
