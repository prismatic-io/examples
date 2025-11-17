/**
 * Types for Prismatic event webhook payloads
 */

import zod from "zod";

export const eventTypes = [
  "instance.updated",
  "instance.enabled",
  "instance.disabled",
  "instance.deleted",
];

export const PayloadSchema = zod.object({
  event_type: zod.enum(eventTypes),
  user: zod.object({
    id: zod.string(),
    email: zod.string(),
    name: zod.string(),
  }),
  timestamp: zod.string(),
  organization_id: zod.string(),
  webhook_id: zod.string(),
  instance: zod.object({
    id: zod.string(),
    name: zod.string(),
  }),
});
