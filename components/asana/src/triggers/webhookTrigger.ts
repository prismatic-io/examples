import { trigger, util } from "@prismatic-io/spectral";
import { isHeartbeatData, validateHmac } from "./utils";

export const webhook = trigger({
  display: {
    label: "Webhook",
    description:
      "Receive and validate webhook requests from Asana for webhooks you configure.",
  },
  allowsBranching: true,
  staticBranchNames: ["Notification", "URL Verify"],
  perform: async (context, payload, _params) => {
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
        context.logger.debug("Asana Heartbeat received");
        return Promise.resolve({
          payload,
          branch: "URL Verify",
        });
      } else {
        return Promise.resolve({
          payload,
          branch: "Notification",
        });
      }
    }
  },
  inputs: {},
  synchronousResponseSupport: "invalid",
  scheduleSupport: "invalid",
});
