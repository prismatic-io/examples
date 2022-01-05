import { Storage } from "@google-cloud/storage";
import { Connection, ConnectionError, util } from "@prismatic-io/spectral";

export const googleStorageClient = (googleConnection: Connection) => {
  if (googleConnection.key !== "privateKey") {
    throw new ConnectionError(
      googleConnection,
      `Unsupported authorization method ${googleConnection.key}.`
    );
  }

  const client_email = util.types.toString(googleConnection.fields.clientEmail);
  const private_key = util.types
    .toString(googleConnection.fields.private_key)
    .replace(/\\n/g, "\n");
  return new Storage({
    projectId: util.types.toString(googleConnection.fields.projectId),
    credentials: {
      client_email,
      private_key,
    },
  });
};
