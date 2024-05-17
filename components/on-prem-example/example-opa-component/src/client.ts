import { Connection } from "@prismatic-io/spectral";
import { createClient } from "@prismatic-io/spectral/dist/clients/http";

export const createExampleOpaHttpClient = (connection: Connection) => {
  if (connection.fields.host) {
    // We're using an on-prem connection
    const host = new URL(`${connection.fields.endpoint}`).host;
    return createClient({
      baseUrl: `http://${connection.fields.host}:${connection.fields.port}`,
      headers: {
        host,
        authentication: `Bearer ${connection.fields.apiKey}`,
      },
    });
  } else {
    return createClient({
      baseUrl: `${connection.fields.endpoint}`,
      headers: {
        authentication: `Bearer ${connection.fields.apiKey}`,
      },
    });
  }
};
