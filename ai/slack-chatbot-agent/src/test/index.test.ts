// Uncomment this file to run unit tests for your CNI.

import { Connection } from "@prismatic-io/spectral";

import { invokeFlow } from "@prismatic-io/spectral/dist/testing";
import { eventHandler } from "../flows/eventHandler";
import testPayload from "./testPayload";
const {
  token: { access_token },
  ...rest
} = JSON.parse(process.env.PRISMATIC_CONNECTION_VALUE!);

describe("test my flow", () => {
  test(
    "verify the return value of my flow",
    async () => {
      console.log(rest);
      const connection = {
        token: {
          access_token,
        },
        ...rest,
      } as unknown as Connection;
      await invokeFlow(eventHandler, {
        configVars: {
          "Slack Connection": connection,
          OPENAI_API_KEY: {
            fields: { apiKey: process.env.OPENAI_API_KEY || "" },
          },
          TAVILY_API_KEY: {
            fields: {
              apiKey: process.env.TAVILY_API_KEY || "",
            },
          },
          PRISMATIC_SIGNING_KEY: process.env.PRISMATIC_SIGNING_KEY || "",
        },
        payload: {
          ...testPayload,
          customer: {
            externalId: "123456",
            id: "123123123123123123",
            name: "Test Customer",
          },
        },
      });
    },
    { timeout: 300000 },
  );
});
