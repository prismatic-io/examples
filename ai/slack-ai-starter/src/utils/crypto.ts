import crypto from "crypto";

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
