import { flow } from "@prismatic-io/spectral";
import { findUserByEmail, getCallsExtensive, getCallTranscripts } from "../services/gongApi";
import { createGongClient } from "../services/gongClient";
import { getDefaultDateRange } from "../utils/dateHelpers";

export const searchUserCallsFlow = flow({
  name: "Search User Calls",
  stableKey: "search-user-calls",
  description: "Get all calls for a specific user email address",
  isAgentFlow: true,
  isSynchronous: true,
  schemas: {
    invoke: {
      type: "object",
      properties: {
        userEmail: {
          type: "string",
          format: "email",
          description: "Email address of the user to search for",
        },
        fromDate: {
          type: "string",
          format: "date-time",
          description: "Start date (ISO format). Defaults to 30 days ago",
        },
        toDate: {
          type: "string",
          format: "date-time",
          description: "End date (ISO format). Defaults to now",
        },
        includeTranscripts: {
          type: "boolean",
          default: false,
          description: "Whether to include transcript snippets in the response",
        },
      },
      required: ["userEmail"],
    },
  },
  endpointSecurityType: "customer_optional",
  onExecution: async (context, params) => {
    const { configVars } = context;
    const credentials = configVars["Gong API Credentials"];

    if (!credentials?.fields?.accessKey || !credentials?.fields?.secretKey) {
      throw new Error("Gong API credentials not configured");
    }

    const inputData = params.onTrigger.results.body.data as {
      userEmail: string;
      includeTranscripts?: boolean;
      fromDate?: string;
      toDate?: string;
    };

    const { userEmail, includeTranscripts = false } = inputData;
    let { fromDate, toDate } = inputData;

    // Use default date range if not provided
    if (!fromDate || !toDate) {
      const defaultRange = getDefaultDateRange();
      fromDate = fromDate || defaultRange.fromDate;
      toDate = toDate || defaultRange.toDate;
    }

    const client = createGongClient(
      credentials.fields.accessKey as string,
      credentials.fields.secretKey as string,
    );

    try {
      // First, look up the user by email to verify they exist
      const user = await findUserByEmail(client, userEmail);

      if (!user) {
        return {
          data: {
            calls: [],
            totalFound: 0,
            searchCriteria: {
              userEmail,
              fromDate,
              toDate,
            },
            user: null,
            message: `No user found with email: ${userEmail}`,
          },
        };
      }
      // Get extensive call data filtered by user ID
      const response = await getCallsExtensive(client, fromDate, toDate, [user.id]);
      // All calls are already filtered by the API
      const userCalls = response.calls;
      // Format the response
      const formattedCalls = userCalls.map((call) => ({
        id: call.metaData.id,
        title: call.metaData.title,
        scheduled: call.metaData.scheduled,
        started: call.metaData.started,
        duration: call.metaData.duration,
        url: call.metaData.url,
        participants: call.parties.map((party) => ({
          name: party.name,
          email: party.emailAddress,
          affiliation: party.affiliation,
        })),
        userRole: call.parties.find(
          (p) => p.emailAddress?.toLowerCase() === userEmail.toLowerCase(),
        )?.affiliation,
      }));

      // Optionally attach a short transcript snippet to each call
      const TRANSCRIPT_BATCH_SIZE = 100;
      const SNIPPET_LENGTH = 1000;
      const snippets = new Map<string, string>();
      if (includeTranscripts) {
        const callIds = formattedCalls.map((call) => call.id);
        for (let i = 0; i < callIds.length; i += TRANSCRIPT_BATCH_SIZE) {
          const { callTranscripts } = await getCallTranscripts(
            client,
            callIds.slice(i, i + TRANSCRIPT_BATCH_SIZE),
          );
          for (const transcript of callTranscripts) {
            const text = transcript.transcript
              .flatMap((monologue) => monologue.sentences.map((sentence) => sentence.text))
              .join(" ");
            snippets.set(transcript.callId, text.slice(0, SNIPPET_LENGTH));
          }
        }
      }
      const calls = includeTranscripts
        ? formattedCalls.map((call) => ({
            ...call,
            transcriptSnippet: snippets.get(call.id) ?? null,
          }))
        : formattedCalls;

      return {
        data: {
          calls,
          totalFound: formattedCalls.length,
          searchCriteria: {
            userEmail,
            fromDate,
            toDate,
          },
          user: {
            id: user.id,
            email: user.emailAddress,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.emailAddress,
            active: user.active,
          },
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to search user calls: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
});

export default searchUserCallsFlow;
