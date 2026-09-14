import { Connection, util } from "@prismatic-io/spectral";
import jsforce from "jsforce";
import { SALESFORCE_API_VERSION } from "./constants";

export const createSfdcClient = (conn: Connection) => {
  return new jsforce.Connection({
    instanceUrl: util.types.toString(conn.token?.instance_url),
    accessToken: util.types.toString(conn.token?.access_token),
    // Pin the API version explicitly. jsforce defaults to an old version (50.0),
    // which the Salesforce Metadata API rejects for newer features — e.g. the
    // outbound-message action in a record-triggered Flow requires v53+.
    version: SALESFORCE_API_VERSION,
  });
};
