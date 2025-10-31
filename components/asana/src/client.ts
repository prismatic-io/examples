import { type Connection, ConnectionError } from "@prismatic-io/spectral";
import {
  createClient,
  type HttpClient,
} from "@prismatic-io/spectral/dist/clients/http";

export const createAsanaClient = async (
  asanaConnection: Connection,
  debug: boolean,
): Promise<HttpClient> => {
  const asanaClient = createClient({
    baseUrl: "https://app.asana.com/api/1.0",
    headers: {
      authorization: `Bearer ${
        asanaConnection?.token?.access_token || asanaConnection?.fields?.apiKey
      }`,
    },
    debug,
  });

  try {
    await asanaClient.get("/users/me");
  } catch (err) {
    throw new ConnectionError(
      asanaConnection,
      `Unsupported connection properties ${err}.`,
    );
  }

  return asanaClient;
};
