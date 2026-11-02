/**
 * Server to handle Prismatic event webhooks
 */

import express from "express";
import { createHmac } from "node:crypto";
import config from "./config";
import {
  handleInstanceUpdated,
  handleInstanceDeleted,
  handleInstanceDisabled,
  handleInstanceEnabled,
} from "./handleEvents";
import { isEventType, PayloadSchema, type EventType } from "./types";

// Create an express app
const app = express();

// POST endpoint to handle Prismatic event webhooks
app.post(
  "/prismatic-events",
  express.raw({ type: "application/json" }), // Middleware to get raw body for HMAC verification
  (req, res) => {
    const eventType = req.headers["x-webhook-event"];
    if (!isEventType(eventType)) {
      console.warn(`Rejecting unsupported event type: ${eventType}`);
      return res.status(400).send({ error: "Unsupported event type" });
    }

    // Get HMAC signature from header and compare it to the one we generate
    const signatureHeader = req.headers["x-webhook-signature"];
    const signature = createHmac("sha256", config.signingSecret)
      .update(req.body)
      .digest("hex");

    // If the signatures don't match, return a 401
    if (signatureHeader !== `sha256=${signature}`) {
      console.warn("Rejecting request with invalid HMAC signature");
      return res.status(401).send({ error: "Invalid signature" });
    }

    const parsedPayload = PayloadSchema.safeParse(
      JSON.parse(req.body.toString()),
    );
    if (!parsedPayload.success) {
      console.warn("Invalid payload received", parsedPayload.error);
      return res
        .status(400)
        .send({ error: "Invalid payload", details: parsedPayload.error });
    }

    const payload = parsedPayload.data;

    const handlers: Record<EventType, (instanceId: string) => Promise<void>> = {
      "instance.updated": handleInstanceUpdated,
      "instance.enabled": handleInstanceEnabled,
      "instance.disabled": handleInstanceDisabled,
      "instance.deleted": handleInstanceDeleted,
    };

    // Process the event asynchronously so we can respond to Prismatic quickly.
    // Catch errors so a failed handler doesn't crash the server with an
    // unhandled promise rejection.
    handlers[payload.event_type](payload.instance.id).catch((err) => {
      console.error(
        `Error handling ${payload.event_type} for instance ${payload.instance.id}:`,
        err,
      );
    });

    res.status(200).send({ status: "success" });
  },
);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
