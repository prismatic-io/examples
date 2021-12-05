import axios from "axios";
import { Connection, util } from "@prismatic-io/spectral";

export function getAcmeErpClient(acmeConnection: Connection) {
  const { apiKey, endpoint } = acmeConnection.fields;

  // Return an HTTP client that has been configured to point
  // towards endpoint URL, and passes an API key as a header
  return axios.create({
    baseURL: util.types.toString(endpoint),
    headers: {
      Accept: "application/json", // Our API returns JSON
      Authorization: `Bearer ${apiKey}`,
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}
