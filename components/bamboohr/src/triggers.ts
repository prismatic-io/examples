import { trigger, util } from "@prismatic-io/spectral";
import crypto from "crypto";

const validateHmac = (
  rawBody,
  timestamp: string,
  signature: string,
  secrets: string[],
) => {
  const body = util.types.toString(rawBody.data);
  for (const secret of secrets) {
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${body}${timestamp}`)
      .digest("hex");
    if (computedSignature === signature) {
      return;
    }
  }
  throw new Error(
    "The included signing signature does not match a known BambooHR signing key for this integration. Rejecting payload.",
  );
};

const bamboohrTrigger = trigger({
  display: {
    label: "Webhook",
    description:
      "Receive and validate webhook requests from BambooHR for webhooks you configure.",
  },
  perform: async (context, payload) => {
    const headers = util.types.lowerCaseHeaders(payload.headers);
    const bamboohrSignature = headers["x-bamboohr-signature"];
    const bamboohrTimestamp = headers["x-bamboohr-timestamp"];
    const secrets = context.crossFlowState.webhookSecrets as string[];

    validateHmac(
      payload.rawBody,
      bamboohrTimestamp,
      bamboohrSignature,
      secrets || [],
    );

    return Promise.resolve({
      payload,
    });
  },
  inputs: {},
  synchronousResponseSupport: "invalid",
  scheduleSupport: "invalid",
});

export default { bamboohrTrigger };
