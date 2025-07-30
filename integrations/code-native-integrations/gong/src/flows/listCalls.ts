import { flow } from "@prismatic-io/spectral";
import { createGongClient } from "../services/gongClient";
import { listCalls } from "../services/gongApi";
import { getDefaultDateRange } from "../utils/dateHelpers";

export const listCallsFlow = flow({
  name: "List Calls",
  stableKey: "list-calls",
  description: "Retrieve a list of calls within a date range",
  isSynchronous: true,
  schemas: {
    invoke: {
      type: "object",
      properties: {
        fromDate: {
          type: "string",
          format: "date-time",
          description: "Start date (ISO format, e.g., 2024-01-01T00:00:00Z)",
        },
        toDate: {
          type: "string",
          format: "date-time",
          description: "End date (ISO format, e.g., 2024-01-31T23:59:59Z)",
        },
        limit: {
          type: "number",
          default: 100,
          description: "Maximum number of calls to retrieve",
        },
      },
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
      fromDate?: string;
      toDate?: string;
      limit?: number;
    };

    // Use provided dates or fall back to last 7 days
    let { fromDate, toDate } = inputData;
    const { limit = 100 } = inputData;

    if (!fromDate || !toDate) {
      const defaultRange = getDefaultDateRange(7);
      fromDate = fromDate || defaultRange.fromDate;
      toDate = toDate || defaultRange.toDate;
    }

    const client = createGongClient(
      credentials.fields.accessKey as string,
      credentials.fields.secretKey as string,
    );

    try {
      const response = await listCalls(client, fromDate, toDate);

      // Limit the results if specified
      const limitedCalls = limit
        ? response.calls.slice(0, limit)
        : response.calls;

      return {
        data: {
          calls: limitedCalls,
          totalRecords: response.records.totalRecords,
          currentPageNumber: response.records.currentPageNumber,
          hasMore: response.cursor ? true : false,
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to list calls: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
});

export default listCallsFlow;
