/**
 * Types for Prismatic event webhook payloads
 */

import { z } from "zod";

export const eventTypes = [
  "instance.updated",
  "instance.enabled",
  "instance.disabled",
  "instance.deleted",
] as const;

export type EventType = (typeof eventTypes)[number];

export const isEventType = (value: unknown): value is EventType =>
  eventTypes.includes(value as EventType);

export const PayloadSchema = z.object({
  event_type: z.enum(eventTypes),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
  }),
  timestamp: z.string(),
  organization_id: z.string(),
  webhook_id: z.string(),
  instance: z.object({
    id: z.string(),
    name: z.string(),
  }),
});
