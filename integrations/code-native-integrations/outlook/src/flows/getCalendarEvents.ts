import { flow } from "@prismatic-io/spectral";
import { type GetCalendarEventsInput } from "../schemas/flows";
import { createGraphClient, extractAccessToken } from "../services/graphClient";

export const getCalendarEvents = flow({
  name: "Get Calendar Events",
  stableKey: "get-calendar-events",
  description: "Retrieve calendar events within a specified date range",
  isSynchronous: true,
  schemas: {
    invoke: {
      properties: {
        startDate: {
          type: "string",
          description: "Start date (ISO format, e.g., 2024-01-01T00:00:00Z)",
        },
        endDate: {
          type: "string",
          description: "End date (ISO format, e.g., 2024-01-31T23:59:59Z)",
        },
        includeRecurring: {
          type: "boolean",
          description: "Include recurring events",
        },
        showAs: {
          type: "string",
          description: "Filter by availability status (all, free, busy)",
        },
      },
    },
  },
  endpointSecurityType: "customer_optional",
  onExecution: async (context, params) => {
    const { configVars } = context;
    const connection = configVars["Microsoft Outlook Connection"];
    const accessToken = extractAccessToken(connection);

    const client = createGraphClient(accessToken);

    // Get input data from trigger payload
    const input = params.onTrigger.results.body.data as GetCalendarEventsInput;

    // Build the query filter for date range
    const filters: string[] = [];
    filters.push(`start/dateTime ge '${input.startDate}'`);
    filters.push(`end/dateTime le '${input.endDate}'`);

    // Add showAs filter if specified
    if (input.showAs && input.showAs !== "all") {
      filters.push(`showAs eq '${input.showAs}'`);
    }

    try {
      // Build the request
      let request = client
        .api("/me/events")
        .select(
          "id,subject,start,end,location,attendees,isOnlineMeeting,onlineMeetingUrl,bodyPreview,showAs,isAllDay",
        )
        .orderby("start/dateTime")
        .filter(filters.join(" and "));

      // Handle recurring events
      if (!input.includeRecurring) {
        request = request.filter("type eq singleInstance");
      }

      const response = await request.get();

      return {
        data: {
          events: response.value,
          count: response.value.length,
        },
      };
    } catch (e) {
      const error = e as Error;
      throw new Error(`Failed to get calendar events: ${error.message}`);
    }
  },
});

export default getCalendarEvents;
