import { input, trigger, util } from "@prismatic-io/spectral";
import crypto from "crypto";

const dropboxWebhook = trigger({
  display: {
    label: "Dropbox Webhook Trigger",
    description: "Trigger for handling webhooks from Dropbox's change API",
  },
  allowsBranching: true,
  staticBranchNames: ["Notification", "Verification Request"],
  inputs: {
    signingSecret: input({
      label: "Signing Secret",
      type: "password",
      required: true,
      comments: "The 'App Secret' of your Dropbox app",
      clean: util.types.toString,
    }),
  },
  perform: async (context, payload, params) => {
    // If it's an initial verification request, process it and stop
    if (payload.queryParameters?.challenge) {
      return Promise.resolve({
        payload,
        response: {
          statusCode: 200,
          contentType: "text/plain",
          body: payload.queryParameters.challenge,
        },
        branch: "Verification Request",
      });
    }

    // Verify the signing secret is correct
    const requestBody = util.types.toString(payload.rawBody.data);
    const computedSignature = crypto
      .createHmac("sha256", params.signingSecret)
      .update(requestBody, "utf8")
      .digest("hex");
    const payloadSignature = util.types.toString(
      payload.headers["X-Dropbox-Signature"]
    );
    if (payloadSignature !== computedSignature) {
      throw new Error(
        "Error validating message signature. Check your signing secret and verify that this message came from Dropbox."
      );
    }

    return Promise.resolve({
      payload,
      branch: "Notification",
    });
  },
  synchronousResponseSupport: "invalid",
  scheduleSupport: "invalid",
});

export default { dropboxWebhook };
