import { trigger, TriggerPayload, util } from "@prismatic-io/spectral";
import crypto from "crypto";

const isHeartbeatData = (data: any): boolean =>
  typeof data === "object" &&
  Array.isArray(data.events) &&
  data.events.length === 0;

const validateHmac = (
  payload: TriggerPayload,
  signature: string,
  secrets: string[]
) => {
  const body = util.types.toString(payload.rawBody.data);
  for (const secret of secrets) {
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");
    if (computedSignature === signature) {
      return;
    }
  }
  throw new Error(
    "The included signing signature does not match a known Asana signing key. Rejecting."
  );
};

export const webhook = trigger({
  display: {
    label: "Asana Webhook",
    description: "Handle and validate webhook requests from Asana",
  },
  allowsBranching: true,
  staticBranchNames: ["Notification", "URL Verify"],
  perform: async (context, payload, params) => {
    const headers = util.types.lowerCaseHeaders(payload.headers);
    const webhookSecret = headers["x-hook-secret"];
    const secrets = context.instanceState["webhookSecrets"] as string[];

    if (webhookSecret) {
      // This is the first time a webhook has been sent.
      // Save the secret off for later use in HMAC validation.

      // Append the new webhook secret to the existing list, if there is one
      const webhookSecrets = secrets
        ? [...new Set([...secrets, webhookSecret])]
        : [webhookSecret];

      return Promise.resolve({
        payload,
        response: {
          statusCode: 200,
          headers: {
            "X-Hook-Secret": webhookSecret,
          },
          contentType: "text/plain",
        },
        branch: "URL Verify",
        instanceState: {
          webhookSecrets,
        },
      });
    } else {
      // It's a normal notification or heartbeat. We need to validate HMAC
      validateHmac(payload, headers["x-hook-signature"], secrets || []);

      if (isHeartbeatData(payload.body.data)) {
        // Asana sent a "Heartbeat" event https://developers.asana.com/docs/webhook-heartbeat-events
        console.debug("Asana Heartbeat received");
        return Promise.resolve({
          payload,
          response: { statusCode: 200, contentType: "text/plain" },
          branch: "URL Verify",
        });
      } else {
        return Promise.resolve({
          payload,
          response: { statusCode: 200, contentType: "text/plain" },
          branch: "Notification",
        });
      }
    }
  },
  inputs: {},
  synchronousResponseSupport: "invalid",
  scheduleSupport: "invalid",
});

export default { webhook };
