import { Tool, tool } from "@openai/agents";
import { FlowConfig } from "../../prismatic/types";
import { invokeFlow } from "../../prismatic/api";

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
