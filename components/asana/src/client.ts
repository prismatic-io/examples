import { Connection, ConnectionError } from "@prismatic-io/spectral";
import Axios from "axios";

export const createAsanaClient = async (asanaConnection: Connection) => {
  const asanaClient = Axios.create({
    baseURL: "https://app.asana.com/api/1.0",
    headers: {
      authorization: `Bearer ${
        asanaConnection?.token?.access_token || asanaConnection?.fields?.apiKey
      }`,
    },
  });

  try {
    await asanaClient.get("/users/me");
  } catch (err) {
    throw new ConnectionError(
      asanaConnection,
      `Unsupported connection properties ${err}.`
    );
  }

  return asanaClient;
};
