import { flow } from "@prismatic-io/spectral";
import { type CreateCalendarEventInput } from "../schemas/flows";
import { createGraphClient, extractAccessToken } from "../services/graphClient";
interface CalendarEvent {
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  allowNewTimeProposals: boolean;
  location?: {
    displayName: string;
  };
  body?: {
    contentType: string;
    content: string;
  };
  attendees?: {
    emailAddress: { address: string };
    type: string;
  }[];
  isOnlineMeeting?: boolean;
  onlineMeetingProvider?: string;
  reminderMinutesBeforeStart?: number;
  isReminderOn?: boolean;
}

export const createCalendarEvent = flow({
  name: "Create Calendar Event",
  stableKey: "create-calendar-event",
  description:
    "Create a new calendar event with optional attendees and online meeting",
  isSynchronous: true,
  schemas: {
    invoke: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Event title",
        },
        startTime: {
          type: "string",
          description: "Start time (ISO format, e.g., 2024-01-15T14:00:00Z)",
          format: "date-time",
        },
        endTime: {
          type: "string",
          description: "End time (ISO format, e.g., 2024-01-15T15:00:00Z)",
          format: "date-time",
        },
        attendees: {
          type: "array",
          description: "Attendee email addresses",
          items: { type: "string", format: "email" },
        },
        location: {
          type: "string",
          description: "Event location",
        },
        description: {
          type: "string",
          description: "Event description",
        },
        isOnlineMeeting: {
          type: "boolean",
          description: "Create Teams meeting",
        },
        reminderMinutes: {
          type: "number",
          description: "Reminder time before event (in minutes)",
        },
      },
      required: ["title", "startTime", "endTime"],
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
      .data as CreateCalendarEventInput;

    // Build the event object
    const event: CalendarEvent = {
      subject: input.title,
      start: {
        dateTime: input.startTime,
        timeZone: "UTC",
      },
      end: {
        dateTime: input.endTime,
        timeZone: "UTC",
      },
      allowNewTimeProposals: true,
    };

    // Add location if provided
    if (input.location) {
      event.location = {
        displayName: input.location,
      };
    }

    // Add description if provided
    if (input.description) {
      event.body = {
        contentType: "HTML",
        content: input.description,
      };
    }

    // Add attendees if provided
    if (input.attendees && input.attendees.length > 0) {
      event.attendees = input.attendees.map((email: string) => ({
        emailAddress: { address: email },
        type: "required",
      }));
    }

    // Set online meeting
    if (input.isOnlineMeeting) {
      event.isOnlineMeeting = true;
      event.onlineMeetingProvider = "teamsForBusiness";
    }

    // Add reminder if specified
    if (input.reminderMinutes) {
      event.reminderMinutesBeforeStart = input.reminderMinutes;
      event.isReminderOn = true;
    }

    try {
      // Create the event
      const response = await client.api("/me/events").post(event);

      return {
        data: {
          id: response.id,
          subject: response.subject,
          start: response.start,
          end: response.end,
          location: response.location,
          onlineMeeting: response.isOnlineMeeting
            ? {
                joinUrl: response.onlineMeeting?.joinUrl,
              }
            : null,
          attendees: response.attendees,
        },
      };
    } catch (e) {
      const error = e as Error;
      throw new Error(`Failed to create calendar event: ${error.message}`);
    }
  },
});

export default createCalendarEvent;
