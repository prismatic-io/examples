import { type Connection, util } from "@prismatic-io/spectral";
import { createClient } from "@prismatic-io/spectral/dist/clients/http";

export function createAcmeClient(acmeConnection: Connection) {
  const { apiKey, baseUrl } = acmeConnection.fields;

  return createClient({
    baseUrl: util.types.toString(baseUrl),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  });
}
