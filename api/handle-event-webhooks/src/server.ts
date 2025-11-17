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
import { eventTypes, PayloadSchema } from "./types";

// Create an express app
const app = express();

// POST endpoint to handle Prismatic event webhooks
app.post(
  "/prismatic-events",
  express.raw({ type: "application/json" }), // Middleware to get raw body for HMAC verification
  (req, res) => {
    const eventType = req.headers["x-webhook-event"];
    if (!eventTypes.includes(eventType as string)) {
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

    switch (payload.event_type) {
      case "instance.updated":
        handleInstanceUpdated(payload.instance.id);
        break;
      case "instance.enabled":
        handleInstanceEnabled(payload.instance.id);
        break;
      case "instance.disabled":
        handleInstanceDisabled(payload.instance.id);
        break;
      case "instance.deleted":
        handleInstanceDeleted(payload.instance.id);
        break;
      default:
        console.warn(`Unhandled event type: ${payload.event_type}`);
        return res.status(400).send({ error: "Unhandled event type" });
    }
    res.status(200).send({ status: "success" });
  },
);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
