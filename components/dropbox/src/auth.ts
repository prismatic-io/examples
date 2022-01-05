// FIXME: This doesn't seem proper.
// See https://github.com/dropbox/dropbox-sdk-js/issues/201
//import { Dropbox } from "dropbox";
import { Dropbox } from "dropbox/dist/Dropbox-sdk.min";
import fetch from "isomorphic-fetch";

import { Connection, ConnectionError } from "@prismatic-io/spectral";

export const createAuthorizedClient = async (dropboxConnection: Connection) => {
  const client = new Dropbox({
    accessToken: dropboxConnection.token.access_token,
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
