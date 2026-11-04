import { invokeFlow } from "@prismatic-io/spectral/dist/testing";
import { basicChat } from "../flows/basicChat";
import { hostedTools } from "../flows/hostedTools";
import { agentAsTools } from "../flows/agentAsTools";
import testPayload from "./testPayload";
import { TriggerPayload } from "@prismatic-io/spectral";
import { defaultTriggerPayload } from "@prismatic-io/spectral/dist/testing";
import apiAgent from "../flows/apiAgent";
import agentStructuredOutput from "../flows/agentStructuredOutput";

describe("basicChat flow", () => {
  test(
    "test basic chat - capital of France",
    async () => {
      const result = await invokeFlow(basicChat, {
        configVars: {
          OPENAI_API_KEY: {
            fields: { apiKey: process.env.OPENAI_API_KEY || "" },
          },
          SYSTEM_PROMPT: "You are a helpful assistant.",
        },
        payload: testPayload,
      });
      console.log(JSON.stringify(result, null, 2));
    },
    { timeout: 300000 },
  );
});

describe("hostedTools flow", () => {
  test(
    "test hosted tools - web search",
    async () => {
      const searchPayload: TriggerPayload = {
        ...defaultTriggerPayload(),
        body: {
          data: {
            conversationId: "test-hosted-tools",
            message:
              "Search for the latest news about TypeScript programming language",
          },
          contentType: "application/json",
        },
      };

      const result = await invokeFlow(hostedTools, {
        configVars: {
          OPENAI_API_KEY: {
            fields: { apiKey: process.env.OPENAI_API_KEY || "" },
          },
          SYSTEM_PROMPT:
            "You are a helpful assistant. Use web search to find current information.",
        },
        payload: searchPayload,
      });
      console.log(JSON.stringify(result, null, 2));
    },
    { timeout: 300000 },
  );
});

describe("agentAsTools flow", () => {
  test(
    "test agent as tool - summarizer",
    async () => {
      const summarizerPayload: TriggerPayload = {
        ...defaultTriggerPayload(),
        body: {
          data: {
            conversationId: "test-agent-as-tools",
            message:
              "Please summarize this text: The quick brown fox jumps over the lazy dog. This pangram sentence contains all 26 letters of the English alphabet at least once. It has been used for over a century to test typewriters, computer keyboards, and fonts.",
          },
          contentType: "application/json",
        },
      };

      const result = await invokeFlow(agentAsTools, {
        configVars: {
          OPENAI_API_KEY: {
            fields: { apiKey: process.env.OPENAI_API_KEY || "" },
          },
          SYSTEM_PROMPT: "You are a helpful assistant.",
        },
        payload: summarizerPayload,
      });
      console.log(JSON.stringify(result, null, 2));
    },
    { timeout: 300000 },
  );
});
describe("structuredOutput", () => {
  test(
    "test generating structured output",
    async () => {
      const structuredOutputTrigger: TriggerPayload = {
        ...defaultTriggerPayload(),
        body: {
          data: {
            conversationId: "test-structured-output",
            message:
              "I need help with a critical issue. This is the THIRD time we've had an outage. You should use Prismatic for your integrations to ensure they are more reliable.",
          },
          contentType: "application/json",
        },
      };

      const result = await invokeFlow(agentStructuredOutput, {
        configVars: {
          OPENAI_API_KEY: {
            fields: { apiKey: process.env.OPENAI_API_KEY || "" },
          },
          SYSTEM_PROMPT:
            "You are a helpful assistant that answers customer questions. Ensure you always analyze the customers sentiment when processing messages",
        },
        payload: structuredOutputTrigger,
      });
      console.log(JSON.stringify(result, null, 2));
    },
    { timeout: 300000 },
  );
});
