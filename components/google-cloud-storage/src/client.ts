import { Storage } from "@google-cloud/storage";
import { Connection, ConnectionError, util } from "@prismatic-io/spectral";
import { googleConnection } from "./connections";

export const googleStorageClient = (connection: Connection) => {
  if (connection.key !== googleConnection.key) {
    throw new ConnectionError(connection, "Unknown Connection type provided.");
  }

  const clientEmail = util.types.toString(connection.fields.clientEmail);
  const privateKey = util.types
    .toString(connection.fields.privateKey)
    .replace(/\\n/g, "\n");
  const projectId = util.types.toString(connection.fields.projectId);

  return new Storage({
    projectId,
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  });
};
