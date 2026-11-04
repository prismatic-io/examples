import { checkCalendarEvents } from "./checkCalendarEvents";
import { checkInbox } from "./checkInbox";
import { createCalendarEvent } from "./createCalendarEvent";
import { getCalendarEvents } from "./getCalendarEvents";
import { searchEmails } from "./searchEmails";
import { sendEmail } from "./sendEmail";

export default [
  checkInbox,
  checkCalendarEvents,
  searchEmails,
  sendEmail,
  getCalendarEvents,
  createCalendarEvent,
];
