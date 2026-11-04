/**
 * These tests call the real Gong API. They are skipped unless
 * GONG_API_ACCESS_KEY and GONG_API_SECRET_KEY are set (for example, in a
 * local .env file). Set GONG_TEST_USER_EMAIL to run the user search test.
 */
import { defaultTriggerPayload, invokeFlow } from "@prismatic-io/spectral/testing";
import { describe, expect, test } from "vitest";
import { getTranscriptsFlow } from "./flows/getTranscripts";
import { listCallsFlow } from "./flows/listCalls";
import { searchUserCallsFlow } from "./flows/searchUserCalls";

const accessKey = process.env.GONG_API_ACCESS_KEY;
const secretKey = process.env.GONG_API_SECRET_KEY;
const testUserEmail = process.env.GONG_TEST_USER_EMAIL;

const configVars = {
  "Gong API Credentials": {
    key: "gongApiCredentials",
    fields: { accessKey: accessKey ?? "", secretKey: secretKey ?? "" },
  },
};

describe.skipIf(!accessKey || !secretKey)("Gong flows (live API)", () => {
  test("lists calls with no filters", async () => {
    const { result } = await invokeFlow(listCallsFlow, {
      configVars,
      payload: { ...defaultTriggerPayload() },
    });

    expect(result?.data).toHaveProperty("calls");
  });

  test("lists calls with filters", async () => {
    const { result } = await invokeFlow(listCallsFlow, {
      configVars,
      payload: {
        ...defaultTriggerPayload(),
        body: {
          data: {
            fromDate: "2025-07-01T00:00:00Z",
            toDate: "2025-07-30T23:59:59Z",
            limit: 100,
          },
        },
      },
    });

    expect(result?.data).toHaveProperty("calls");
  });

  test.skipIf(!testUserEmail)(
    "searches calls for a specific user and fetches transcripts",
    { timeout: 300000 },
    async () => {
      const { result } = await invokeFlow(searchUserCallsFlow, {
        configVars,
        payload: {
          ...defaultTriggerPayload(),
          body: {
            data: {
              userEmail: testUserEmail,
              includeTranscripts: false,
            },
          },
        },
      });

      const calls = (result?.data as { calls?: { id: string }[] } | undefined)?.calls ?? [];
      const callIds = calls.map((call) => call.id);
      if (callIds.length === 0) {
        return;
      }

      const { result: transcriptResult } = await invokeFlow(getTranscriptsFlow, {
        configVars,
        payload: {
          ...defaultTriggerPayload(),
          body: { data: { callIds } },
        },
      });

      expect(transcriptResult?.data).toHaveProperty("transcripts");
    },
  );
});
