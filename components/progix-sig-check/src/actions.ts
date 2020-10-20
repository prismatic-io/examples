import generateSignature from "./signature";
import { action } from "@prismatic-io/spectral";

import {
  signatureInputField,
  bodyInputField,
  secretInputField,
} from "./inputs";

export const verifySignature = action({
  key: "verifySignature",
  display: {
    label: "Verify Signature",
    description:
      "Throws an exception if the request did not originate from a Progix application",
  },
  perform: async (
    { logger },
    { signature: expectedSignature, body, secret }
  ) => {
    const calculatedSignature = generateSignature(secret, body);

    if (calculatedSignature !== expectedSignature) {
      throw Error(
        "Unexpected signature, request did not originate from a known Progix application."
      );
    }

    logger.info("Verified valid request signature.");
  },
  inputs: [signatureInputField, bodyInputField, secretInputField],
});

export default {
  ...verifySignature,
};
