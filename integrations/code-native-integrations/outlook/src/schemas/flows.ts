import { z, toJSONSchema } from "zod";

// Search Emails Schema
export const searchEmailsSchema = z.object({
  query: z.string().optional().describe("Search terms to find in emails"),
  from: z.string().optional().describe("Sender email address"),
  subject: z.string().optional().describe("Words in the subject line"),
  hasAttachments: z
    .boolean()
    .optional()
    .describe("Only emails with attachments"),
  unreadOnly: z.boolean().optional().describe("Only unread emails"),
  folder: z
    .enum(["inbox", "sent", "drafts", "all"])
    .default("inbox")
    .describe("Folder to search in"),
  limit: z.number().default(10).describe("Maximum number of results"),
});

// Send Email Schema
export const sendEmailSchema = z.object({
  to: z.array(z.string()).describe("Recipient email addresses"),
  subject: z.string().describe("Email subject line"),
  body: z.string().describe("Email message content"),
  cc: z.array(z.string()).optional().describe("CC recipients"),
  bcc: z.array(z.string()).optional().describe("BCC recipients"),
  isHtml: z.boolean().default(true).describe("Send as HTML email"),
  importance: z
    .enum(["low", "normal", "high"])
    .default("normal")
    .describe("Email importance level"),
});

// Get Calendar Events Schema
export const getCalendarEventsSchema = z.object({
  startDate: z
    .string()
    .describe("Start date (ISO format, e.g., 2024-01-01T00:00:00Z)"),
  endDate: z
    .string()
    .describe("End date (ISO format, e.g., 2024-01-31T23:59:59Z)"),
  includeRecurring: z
    .boolean()
    .default(true)
    .describe("Include recurring events"),
  showAs: z
    .enum(["all", "free", "busy"])
    .optional()
    .describe("Filter by availability status"),
});

// Create Calendar Event Schema
export const createCalendarEventSchema = z.object({
  title: z.string().describe("Event title"),
  startTime: z
    .string()
    .describe("Start time (ISO format, e.g., 2024-01-15T14:00:00Z)"),
  endTime: z
    .string()
    .describe("End time (ISO format, e.g., 2024-01-15T15:00:00Z)"),
  attendees: z
    .array(z.string())
    .optional()
    .describe("Attendee email addresses"),
  location: z.string().optional().describe("Event location"),
  description: z.string().optional().describe("Event description"),
  isOnlineMeeting: z.boolean().default(false).describe("Create Teams meeting"),
  reminderMinutes: z
    .number()
    .optional()
    .describe("Reminder time before event (in minutes)"),
});

// Find Contacts Schema
export const findContactsSchema = z.object({
  name: z.string().describe("Contact name to search for"),
  includeEmailOnly: z
    .boolean()
    .default(false)
    .describe("Only return contacts with email addresses"),
  limit: z.number().default(10).describe("Maximum number of results"),
});

// Check Inbox Schema (for updating existing flow)
export const checkInboxSchema = z.object({
  unreadOnly: z.boolean().optional().describe("Only show unread messages"),
  limit: z
    .number()
    .default(20)
    .describe("Maximum number of messages to retrieve"),
  includeAttachments: z
    .boolean()
    .default(false)
    .describe("Include attachment details"),
});

// Check Calendar Events Schema (for updating existing flow)
export const checkCalendarEventsSchema = z.object({
  daysAhead: z.number().default(7).describe("Number of days ahead to check"),
  includeAllDay: z.boolean().default(true).describe("Include all-day events"),
});

// Export TypeScript types
export type SearchEmailsInput = z.infer<typeof searchEmailsSchema>;
export type SendEmailInput = z.infer<typeof sendEmailSchema>;
export type GetCalendarEventsInput = z.infer<typeof getCalendarEventsSchema>;
export type CreateCalendarEventInput = z.infer<
  typeof createCalendarEventSchema
>;
export type FindContactsInput = z.infer<typeof findContactsSchema>;
export type CheckInboxInput = z.infer<typeof checkInboxSchema>;
export type CheckCalendarEventsInput = z.infer<
  typeof checkCalendarEventsSchema
>;

// Export JSON schemas for Prismatic
export const searchEmailsJsonSchema = toJSONSchema(searchEmailsSchema);
export const sendEmailJsonSchema = toJSONSchema(sendEmailSchema);
export const getCalendarEventsJsonSchema = toJSONSchema(
  getCalendarEventsSchema,
);
export const createCalendarEventJsonSchema = toJSONSchema(
  createCalendarEventSchema,
);
export const findContactsJsonSchema = toJSONSchema(findContactsSchema);
export const checkInboxJsonSchema = toJSONSchema(checkInboxSchema);
export const checkCalendarEventsJsonSchema = toJSONSchema(
  checkCalendarEventsSchema,
);
