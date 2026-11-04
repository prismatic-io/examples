import { TriggerPayload, util, HttpResponse } from "@prismatic-io/spectral";
import crypto from "crypto";
export interface SlackWebhookRequestBody {
  challenge?: string; // For Slack URL verification
}
export const computeSignature = (
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

export function ack(
  payload: TriggerPayload,
  signingSecret: string,
): {
  response: HttpResponse;
  isRetry: boolean;
  retryNum?: number;
  retryReason?: string;
} {
  const requestBody = util.types.toString(payload.rawBody.data);
  const timestamp = util.types.toInt(
    payload.headers["X-Slack-Request-Timestamp"],
  );

  // Check for retry headers
  const retryNumHeader = payload.headers["X-Slack-Retry-Num"];
  const retryReason = payload.headers["X-Slack-Retry-Reason"];
  const retryNum = retryNumHeader
    ? parseInt(util.types.toString(retryNumHeader))
    : undefined;
  const isRetry = retryNum !== undefined && retryNum > 0;

  if (isRetry) {
    console.log(
      `[Slack] Received retry attempt ${retryNum} with reason: ${retryReason || "unknown"}`,
    );
  }

  // Bypass signature verification for test runs
  if (process.env.NODE_ENV === "test") {
    return {
      response: {
        statusCode: 200,
        body: "",
        contentType: "text/plain",
        headers: {
          "X-Slack-No-Retry": "1",
        },
      } as HttpResponse,
      isRetry,
      retryNum,
      retryReason: retryReason ? util.types.toString(retryReason) : undefined,
    };
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
      headers: {
        "X-Slack-No-Retry": "1",
      },
    };
    return {
      response,
      isRetry: false,
      retryNum: undefined,
      retryReason: undefined,
    };
  }

  // For regular events, return empty 200 OK immediately with no-retry header
  const response: HttpResponse = {
    statusCode: 200,
    body: "",
    contentType: "text/plain",
    headers: {
      "X-Slack-No-Retry": "1", // Prevent further retries
    },
  };

  return {
    response,
    isRetry,
    retryNum,
    retryReason: retryReason ? util.types.toString(retryReason) : undefined,
  };
}
