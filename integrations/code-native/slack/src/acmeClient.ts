import { Connection, util } from "@prismatic-io/spectral";
import { createClient } from "@prismatic-io/spectral/http";

export const createAcmeClient = (connection: Connection, debug = false) =>
  createClient({
    baseUrl: util.types.toString(connection.fields?.baseUrl),
    headers: {
      Authorization: `Bearer ${util.types.toString(connection.fields?.apiKey)}`,
      Accept: "application/json",
    },
    debug,
  });
