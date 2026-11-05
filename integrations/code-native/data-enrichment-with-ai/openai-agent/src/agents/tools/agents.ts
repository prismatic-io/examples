import { Agent } from "@openai/agents";

const summarizer = new Agent({
  name: "Summarizer",
  instructions: "Generate a concise summary of the supplied text.",
});

const summarizerTool = summarizer.asTool({
  toolName: "summarize_text",
  toolDescription: "Generate a concise summary of the supplied text.",
});

const toolAgents = {
  summarizer: summarizerTool,
};

export default toolAgents;
