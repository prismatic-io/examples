import { getTools } from "@/util/tools";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const mcpTools = await getTools();

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    tools: { ...mcpTools }, // TODO add built-in tools
    maxSteps: 20,
    onError: (error) => {
      console.error("Error in AI response:", error);
      throw error;
    },
  });

  return result.toDataStreamResponse();
}
