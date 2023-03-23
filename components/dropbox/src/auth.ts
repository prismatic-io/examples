import fetch from "cross-fetch";
import { Dropbox } from "dropbox";
import { Connection, ConnectionError, util } from "@prismatic-io/spectral";

export const createAuthorizedClient = async (dropboxConnection: Connection) => {
  const client = new Dropbox({
    accessToken: util.types.toString(dropboxConnection.token.access_token),
    fetch,
  });

  try {
    await client.checkUser({ query: "Hello, Dropbox" });
  } catch (err) {
    throw new ConnectionError(
      dropboxConnection,
      `The API key provided to Dropbox is not valid or has expired. Error message: ${
        (err as Error).message
      }`
    );
  }

  return client;
};
