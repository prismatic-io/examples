import { Tool } from "@openai/agents";

export interface AgentConfiguration {
  systemPrompt: string;
  openAIKey: string;
  tools?: Tool[];
}
