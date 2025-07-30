import { invokeFlow } from "@prismatic-io/spectral/dist/testing";
import { basicChat } from "../flows/basicChat";
import { hostedTools } from "../flows/hostedTools";
import { agentAsTools } from "../flows/agentAsTools";
import testPayload from "./testPayload";
import { TriggerPayload } from "@prismatic-io/spectral";
import { defaultTriggerPayload } from "@prismatic-io/spectral/dist/testing";
import apiAgent from "../flows/apiAgent";

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

// describe("apiAgent flow", () => {
//   test(
//     "test api agent - get current user info and posts",
//     async () => {
//       const apiLookupPayload: TriggerPayload = {
//         ...defaultTriggerPayload(),
//         body: {
//           data: {
//             conversationId: "test-api-agent",
//             message:
//               "Can you get the info about my current user and then find all my related posts?",
//           },
//           contentType: "application/json",
//         },
//       };

//       const result = await invokeFlow(apiAgent, {
//         configVars: {
//           OPENAI_API_KEY: {
//             fields: { apiKey: process.env.OPENAI_API_KEY || "" },
//           },
//           SYSTEM_PROMPT: "You are a helpful assistant.",
//         },
//         payload: apiLookupPayload,
//       });
//       console.log(JSON.stringify(result, null, 2));
//     },
//     { timeout: 300000 },
//   );
// });
