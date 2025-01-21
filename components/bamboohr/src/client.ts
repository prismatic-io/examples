import { Connection, ConnectionError, util } from "@prismatic-io/spectral";
import { apiKey } from "./connections";
import { createClient } from "@prismatic-io/spectral/dist/clients/http";

export const createBambooClient = (connection: Connection) => {
  if (connection.key !== apiKey.key) {
    throw new ConnectionError(connection, "Unknown Connection type provided.");
  }

  const key = util.types.toString(connection.fields.apiKey);
  const companyDomain = util.types.toString(connection.fields.companyDomain);
  const token = Buffer.from(`${key}:x`).toString("base64");

  return createClient({
    baseUrl: `https://api.bamboohr.com/api/gateway.php/${companyDomain}/`,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Basic ${token}`,
    },
  });
};
