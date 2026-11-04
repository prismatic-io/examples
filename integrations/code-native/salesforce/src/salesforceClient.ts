import { Connection, util } from "@prismatic-io/spectral";
import jsforce from "jsforce";

export const createSalesforceClient = (
  connection: Connection,
  debug = false
) => {
  return new jsforce.Connection({
    instanceUrl: util.types.toString(connection.token?.instance_url),
    version: "61.0",
    accessToken: util.types.toString(connection.token?.access_token),
  });
};
