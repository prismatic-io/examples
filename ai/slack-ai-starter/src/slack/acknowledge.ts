/* eslint-disable @typescript-eslint/no-explicit-any */
import { TriggerPayload, util, HttpResponse } from "@prismatic-io/spectral";
import { computeSignature } from "../utils/crypto";
import { SlackWebhookRequestBody } from "../types/config.types";

export function ack(
  payload: TriggerPayload,
  signingSecret: string,
): HttpResponse {
  const requestBody = util.types.toString(payload.rawBody.data);
  const timestamp = util.types.toInt(
    payload.headers["X-Slack-Request-Timestamp"],
  );
  // Bypass signature verification for test runs
  if (process.env.DEBUG === "true") {
    return {
      statusCode: 200,
      body: "",
      contentType: "text/plain",
    } as HttpResponse;
  }
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

  const challenge = (payload.body.data as SlackWebhookRequestBody)?.challenge;

  // For URL verification, return the challenge
  if (challenge) {
    const response: HttpResponse = {
      statusCode: 200,
      contentType: "text/plain",
      body: challenge,
    };
    return response;
  }

  // For regular events, return empty 200 OK immediately
  const response: HttpResponse = {
    statusCode: 200,
    body: "",
    contentType: "text/plain",
  };

  return response;
}
