// Fake connection for illustration purposes

import { connection, input, util } from "@prismatic-io/spectral";

export const acmeApiKey = connection({
  key: "acmeApiKey",
  label: "Acme API Key",
  inputs: {
    apiKey: input({
      label: "API Key",
      type: "string",
      required: true,
      clean: util.types.toString,
    }),
  },
});

export default [acmeApiKey];
