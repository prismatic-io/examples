import { generateToken } from "@/util/token";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { experimental_createMCPClient as createMCPClient } from "ai";

export const getTools = async () => {
  const prismaticAccessToken = generateToken();

  const MCP_URL = process.env.MCP_URL || "https://mcp.prismatic.io/mcp";

  const transport = new StreamableHTTPClientTransport(new URL(MCP_URL), {
    requestInit: {
      headers: {
        Authorization: `Bearer ${prismaticAccessToken}`,
      },
    },
  });

  const mcpClient = await createMCPClient({
    transport: transport,
    onUncaughtError(error) {
      console.error("Error in MCP client:", error);
      throw error;
    },
  });

  // Remove the "get-me" tool if it exists
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { "get-me": getMe, ...tools } = await mcpClient.tools();
  return tools;
};
