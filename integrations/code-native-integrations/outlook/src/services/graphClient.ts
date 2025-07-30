import { Client } from "@microsoft/microsoft-graph-client";
import { Connection } from "@prismatic-io/spectral";

export function createGraphClient(accessToken: string): Client {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
}

export function extractAccessToken(connection: Connection): string {
  // The connection object from Prismatic stores the token in the token property
  if (!connection?.token?.access_token) {
    throw new Error("No access token found in connection");
  }
  return connection.token.access_token as string;
}
