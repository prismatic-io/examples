import * as jsforce from "jsforce";
import { Connection } from "@prismatic-io/spectral";

export function createSalesforceConnection(
  connection: Connection,
): jsforce.Connection {
  if (!connection?.token?.access_token) {
    throw new Error("No access token found in connection");
  }

  if (!connection?.token?.instance_url) {
    throw new Error("No instance URL found in connection");
  }

  const conn = new jsforce.Connection({
    instanceUrl: connection.token.instance_url as string,
    accessToken: connection.token.access_token as string,
    version: "59.0",
  });

  // If we have a refresh token, set it up
  if (connection.token.refresh_token) {
    conn.refreshToken = connection.token.refresh_token as string;
  }

  return conn;
}

export async function getCurrentUserId(
  conn: jsforce.Connection,
): Promise<string> {
  const identity = await conn.identity();
  return identity.user_id;
}
