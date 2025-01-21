import { HttpResponse, trigger, util } from "@prismatic-io/spectral";
import { connectionInput } from "./inputs";
import crypto from "crypto";
import { URLSearchParams } from "url";

const computeSignature = (
  requestBody: string,
  signingSecret: string,
  timestamp: number,
) => {
  const signatureBaseString = `v0:${timestamp}:${requestBody}`;
  const signature = crypto
    .createHmac("sha256", signingSecret)
    .update(signatureBaseString, "utf8")
    .digest("hex");
  return `v0=${signature}`;
};

interface Request {
  challenge?: string;
}

export const webhook = trigger({
  display: {
    label: "Events API Webhook",
    description:
      "Receive and validate webhook requests from Slack's Events API for webhooks you configure.",
  },
  allowsBranching: true,
  staticBranchNames: ["Notification", "URL Verify", "Management"],
  perform: async (context, payload, params) => {
    const bypassHeader = util.types.toBool(
      payload.headers?.["prismatic-bypass-challenge"] || false,
    );
    if (!bypassHeader) {
      // Validate that the webhook request came from Slack
      // https://api.slack.com/authentication/verifying-requests-from-slack
      const signingSecret = util.types.toString(
        params.slackConnection.fields.signingSecret,
      );
      const requestBody = util.types.toString(payload.rawBody.data);
      const timestamp = util.types.toInt(
        payload.headers["X-Slack-Request-Timestamp"],
      );
      const computedSignature = computeSignature(
        requestBody,
        signingSecret,
        timestamp,
      );
      const payloadSignature = util.types.toString(
        payload.headers["X-Slack-Signature"],
      );
      if (payloadSignature !== computedSignature) {
        throw new Error(
          "Error validating message signature. Check your signing secret and verify that this message came from Slack.",
        );
      }

      // Check if this is a "challenge" URL verification handshake and respond accordingly
      // https://api.slack.com/apis/connections/events-api#subscriptions
      const challenge = (payload.body.data as Request)?.challenge;
      const response: HttpResponse = {
        statusCode: 200,
        contentType: "text/plain",
        body: challenge,
      };

      return Promise.resolve({
        payload,
        response,
        branch: challenge ? "URL Verify" : "Notification",
      });
    } else {
      return Promise.resolve({
        payload,
        branch: "Management",
      });
    }
  },
  inputs: { slackConnection: connectionInput },
  synchronousResponseSupport: "invalid",
  scheduleSupport: "invalid",
});

export const slashCommandWebhook = trigger({
  display: {
    label: "App Webhook",
    description:
      "Trigger for handling slash command and modal webhooks from Slack",
  },
  perform: async (context, payload, params) => {
    const deserializedPayload = Object.fromEntries(
      new URLSearchParams(payload.rawBody.data.toString()),
    );

    const response = {
      statusCode: 200,
      contentType: util.types.toString(params.contentType),
      ...(params.responseBody
        ? { body: util.types.toString(params.responseBody) }
        : {}),
    };

    return Promise.resolve({
      payload: {
        ...payload,
        deserializedBody: deserializedPayload,
      },
      response,
    });
  },
  inputs: {
    responseBody: {
      label: "Response Body",
      type: "code",
      language: "json",
      required: false,
    },
    contentType: {
      label: "Content Type",
      default: "text/plain",
      type: "string",
      model: [
        { label: "text/plain", value: "text/plain" },
        { label: "application/json", value: "application/json" },
      ],
      required: true,
    },
  },
  synchronousResponseSupport: "invalid",
  scheduleSupport: "invalid",
});

export default { webhook, slashCommandWebhook };
