import {
  webSearchTool,
  codeInterpreterTool,
  fileSearchTool,
  Tool,
} from "@openai/agents";

export function createHostedTools(): Tool[] {
  // Setup hosted tools from openai
  const hostedTools = [];
  hostedTools.push(webSearchTool());

  return hostedTools;
}
