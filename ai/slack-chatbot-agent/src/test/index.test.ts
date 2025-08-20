import { Connection } from "@prismatic-io/spectral";
import { invokeFlow } from "@prismatic-io/spectral/dist/testing";
import { eventHandler } from "../flows/eventHandler";
import { testSlackEvent } from "./testPayload";

const {
  token: { access_token },
} = JSON.parse(process.env.PRISMATIC_CONNECTION_VALUE!);

describe("test my flow", () => {
  test(
    "verify the return value of my flow",
    async () => {
      const connection: Connection = {
        key: "slackConnection",
        configVarKey: "Slack Connection",
        fields: {},
        token: {
          access_token,
        },
      };

      await invokeFlow(eventHandler, {
        configVars: {
          "Slack Connection": connection,
          OPENAI_API_KEY: {
            fields: { apiKey: process.env.OPENAI_API_KEY || "" },
          },
          PRISMATIC_REFRESH_TOKEN: process.env.PRISMATIC_REFRESH_TOKEN || "",
        },
        payload: {
          ...testSlackEvent,
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
