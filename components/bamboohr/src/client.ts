import { Connection, ConnectionError, util } from "@prismatic-io/spectral";
import axios from "axios";
import { apiKey } from "./connections";

export const createBambooClient = (connection: Connection) => {
  if (connection.key !== apiKey.key) {
    throw new ConnectionError(connection, "Unknown Connection type provided.");
  }

  const key = util.types.toString(connection.fields.apiKey);
  const companyDomain = util.types.toString(connection.fields.companyDomain);

  return axios.create({
    baseURL: `https://api.bamboohr.com/api/gateway.php/${companyDomain}/`,
    auth: { username: key, password: "x" },
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  });
};
