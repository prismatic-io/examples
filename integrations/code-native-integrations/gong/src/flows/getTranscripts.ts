import { flow } from "@prismatic-io/spectral";
import { createGongClient } from "../services/gongClient";
import { getCallTranscripts } from "../services/gongApi";

export const getTranscriptsFlow = flow({
  name: "Get Call Transcripts",
  stableKey: "get-transcripts",
  description: "Fetch transcripts for specific call IDs",
  isSynchronous: true,
  schemas: {
    invoke: {
      type: "object",
      properties: {
        callIds: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Array of call IDs to fetch transcripts for",
          minItems: 1,
          maxItems: 100
        }
      },
      required: ["callIds"]
    }
  },
  endpointSecurityType: "customer_optional",
  onExecution: async (context, params) => {
    const { configVars } = context;
    const credentials = configVars["Gong API Credentials"]

    if (!credentials?.fields?.accessKey || !credentials?.fields?.secretKey) {
      throw new Error("Gong API credentials not configured");
    }

    const { callIds } = params.onTrigger.results.body.data as { callIds: string[] };

    if (!Array.isArray(callIds) || callIds.length === 0) {
      throw new Error("callIds must be a non-empty array");
    }

    const client = createGongClient(
      credentials.fields.accessKey as string,
      credentials.fields.secretKey as string
    );

    try {
      const response = await getCallTranscripts(client, callIds);

      return {
        data: {
          transcripts: response.callTranscripts,
          requestId: response.requestId
        }
      };
    } catch (error) {
      throw new Error(`Failed to get call transcripts: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
});

export default getTranscriptsFlow;