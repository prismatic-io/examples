import type { TriggerPayload } from "@prismatic-io/spectral";
import { defaultTriggerPayload, invokeFlow } from "@prismatic-io/spectral/testing";
import { agentAsTools } from "../flows/agentAsTools";
import agentStructuredOutput from "../flows/agentStructuredOutput";
import { basicChat } from "../flows/basicChat";
import { hostedTools } from "../flows/hostedTools";
import testPayload from "./testPayload";

// These tests call the live OpenAI API. Set OPENAI_API_KEY (e.g. in .env) to run them.
const describeWithKey = describe.skipIf(!process.env.OPENAI_API_KEY);

describeWithKey("basicChat flow", () => {
  test("test basic chat - capital of France", async () => {
    const result = await invokeFlow(basicChat, {
      configVars: {
        OPENAI_API_KEY: {
          key: "OPENAI_API_KEY",
          fields: { apiKey: process.env.OPENAI_API_KEY || "" },
        },
        SYSTEM_PROMPT: "You are a helpful assistant.",
      },
      payload: testPayload,
    });
    console.log(JSON.stringify(result, null, 2));
  });
});

describeWithKey("hostedTools flow", () => {
  test("test hosted tools - web search", async () => {
    const searchPayload: TriggerPayload = {
      ...defaultTriggerPayload(),
      body: {
        data: {
          conversationId: "test-hosted-tools",
          message: "Search for the latest news about TypeScript programming language",
        },
        contentType: "application/json",
      },
    };

    const result = await invokeFlow(hostedTools, {
      configVars: {
        OPENAI_API_KEY: {
          key: "OPENAI_API_KEY",
          fields: { apiKey: process.env.OPENAI_API_KEY || "" },
        },
        SYSTEM_PROMPT: "You are a helpful assistant. Use web search to find current information.",
      },
      payload: searchPayload,
    });
    console.log(JSON.stringify(result, null, 2));
  });
});

describeWithKey("agentAsTools flow", () => {
  test("test agent as tool - summarizer", async () => {
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
          key: "OPENAI_API_KEY",
          fields: { apiKey: process.env.OPENAI_API_KEY || "" },
        },
        SYSTEM_PROMPT: "You are a helpful assistant.",
      },
      payload: summarizerPayload,
    });
    console.log(JSON.stringify(result, null, 2));
  });
});
describeWithKey("structuredOutput", () => {
  test("test generating structured output", async () => {
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
          key: "OPENAI_API_KEY",
          fields: { apiKey: process.env.OPENAI_API_KEY || "" },
        },
        SYSTEM_PROMPT:
          "You are a helpful assistant that answers customer questions. Ensure you always analyze the customers sentiment when processing messages",
      },
      payload: structuredOutputTrigger,
    });
    console.log(JSON.stringify(result, null, 2));
  });
});
