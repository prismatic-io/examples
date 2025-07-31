import { getTools } from "@/util/tools";

export async function GET() {
  const mcpTools = await getTools();

  return new Response(JSON.stringify(mcpTools), {
    headers: { "Content-Type": "application/json" },
  });
}
