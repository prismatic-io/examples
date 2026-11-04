import { Connection } from "@prismatic-io/spectral";
import { createClient } from "@prismatic-io/spectral/http";

export const createSlackClient = (connection: Connection) => {
  return createClient({
    baseUrl: "https://slack.com/api",
    headers: {
      Authorization: `Bearer ${connection.token?.access_token}`,
    },
  });
};
