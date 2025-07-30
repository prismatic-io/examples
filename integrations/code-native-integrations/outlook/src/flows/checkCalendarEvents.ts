import { flow } from "@prismatic-io/spectral";
import { type CheckCalendarEventsInput } from "../schemas/flows";
import { createGraphClient, extractAccessToken } from "../services/graphClient";

export const checkCalendarEvents = flow({
  name: "Check Calendar Events",
  stableKey: "check-calendar-events",
  description:
    "Check upcoming calendar events for a specified number of days ahead",
  isSynchronous: true,
  schemas: {
    invoke: {
      properties: {
        daysAhead: {
          type: "number",
          description: "Number of days ahead to check",
        },
        includeAllDay: {
          type: "boolean",
          description: "Include all-day events",
        },
      },
      required: ["daysAhead", "includeAllDay"],
    },
  },
  endpointSecurityType: "customer_optional",
  onExecution: async (context, params) => {
    const { configVars } = context;
    const connection = configVars["Microsoft Outlook Connection"];
    const accessToken = extractAccessToken(connection);

    const client = createGraphClient(accessToken);

    // Get input data from trigger payload
    const input = params.onTrigger.results.body
      .data as CheckCalendarEventsInput;

    // Calculate date range
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (input.daysAhead || 7));

    // Build the query filter
    const filters: string[] = [];
    filters.push(`start/dateTime ge '${startDate.toISOString()}'`);
    filters.push(`end/dateTime le '${endDate.toISOString()}'`);

    try {
      // Build the request
      let request = client
        .api("/me/events")
        .select(
          "id,subject,start,end,location,isAllDay,isOnlineMeeting,onlineMeetingUrl,bodyPreview,attendees",
        )
        .orderby("start/dateTime")
        .filter(filters.join(" and "));

      // Filter out all-day events if not wanted
      if (!input.includeAllDay) {
        request = request.filter("isAllDay eq false");
      }

      const response = await request.get();

      return {
        data: {
          events: response.value,
          count: response.value.length,
          dateRange: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
        },
      };
    } catch (e) {
      const error = e as Error;
      throw new Error(`Failed to check calendar events: ${error.message}`);
    }
  },
});

export default checkCalendarEvents;
