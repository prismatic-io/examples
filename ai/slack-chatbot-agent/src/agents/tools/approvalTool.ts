import { tool } from "@openai/agents";
import { z } from "zod";

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
