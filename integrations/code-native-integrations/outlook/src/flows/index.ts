import { checkInbox } from "./checkInbox";
import { checkCalendarEvents } from "./checkCalendarEvents";
import { searchEmails } from "./searchEmails";
import { sendEmail } from "./sendEmail";
import { getCalendarEvents } from "./getCalendarEvents";
import { createCalendarEvent } from "./createCalendarEvent";

export default [
  checkInbox,
  checkCalendarEvents,
  searchEmails,
  sendEmail,
  getCalendarEvents,
  createCalendarEvent,
];
