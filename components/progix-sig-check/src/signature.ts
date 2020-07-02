import crypto from "crypto";

const generateSignature = (key: string, body: string): string => {
  // Calculate the SHA1 HMAC of the body with the given key, get the hex digest,
  // remove any '-', and then convert to uppercase to generate the signature.
  const signature = crypto
    .createHmac("sha1", key)
    .update(body, "utf8")
    .digest("hex")
    .replace(/-/g, "")
    .toUpperCase();

  return signature;
};

export default generateSignature;
