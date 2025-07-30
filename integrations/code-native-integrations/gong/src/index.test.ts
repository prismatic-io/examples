import { defaultTriggerPayload, invokeFlow } from "@prismatic-io/spectral/dist/testing";
import { listCallsFlow } from "./flows/listCalls";
import searchUserCallsFlow from "./flows/searchUserCalls";
import getTranscriptsFlow from "./flows/getTranscripts";


describe("test my flow", () => {
  test(
    "verify the return value of my flow with no filters",
    async () => {


      const { result } = await invokeFlow(listCallsFlow, {
        configVars: {
          "Gong API Credentials": {
            fields: {
              accessKey: process.env.GONG_API_ACCESS_KEY,
              secretKey: process.env.GONG_API_SECRET_KEY,
            }
          },
        },
        payload: {
          ...defaultTriggerPayload(),
        },
      });

      console.log(result)
    },
  );
  test(
    "verify the return value of my flow with filters",
    async () => {
      const { result } = await invokeFlow(listCallsFlow, {
        configVars: {
          "Gong API Credentials": {
            fields: {
              accessKey: process.env.GONG_API_ACCESS_KEY,
              secretKey: process.env.GONG_API_SECRET_KEY,
            }
          },
        },
        payload: {
          ...defaultTriggerPayload(),
          body: {
            data: {
              fromDate: "2025-07-01T00:00:00Z",
              toDate: "2025-07-30T23:59:59Z",
              limit: 100,
            }
          }
        },
      });

      console.log(result)
    },
  );
  test(
    "searching calls for a specific user and get transcripts ",
    async () => {
      const { result } = await invokeFlow(searchUserCallsFlow, {
        configVars: {
          "Gong API Credentials": {
            fields: {
              accessKey: process.env.GONG_API_ACCESS_KEY,
              secretKey: process.env.GONG_API_SECRET_KEY,
            }
          },
        },
        payload: {
          ...defaultTriggerPayload(),
          body: {
            data: {
              userEmail: "jake.hagle@prismatic.io",
            }
          }
        },
      });

      let callIds: string[] = []
      for (const call of result?.data.calls) {
        callIds.push(call.id)
      }

      const { result: transcriptResult } = await invokeFlow(getTranscriptsFlow, {
        configVars: {
          "Gong API Credentials": {
            fields: {
              accessKey: process.env.GONG_API_ACCESS_KEY,
              secretKey: process.env.GONG_API_SECRET_KEY,
            }
          },

        },
        payload: {
          ...defaultTriggerPayload(),
          body: {
            data: {
              callIds
            }
          }
        }
      });
      console.log(result)
    }, { timeout: 300000 }
  );
});
