import { Storage, StorageOptions } from "@google-cloud/storage";
import { OAuth2Client } from "google-auth-library";
import { Connection, ConnectionError, util } from "@prismatic-io/spectral";
import {
  googleOAuthConnection,
  googlePrivateKeyConnection,
} from "./connections";

interface CreateClientParams {
  connection: Connection;
}

const validateConnection = (connection: Connection) => {
  if (
    connection.key !== googleOAuthConnection.key &&
    connection.key !== googlePrivateKeyConnection.key
  ) {
    throw new ConnectionError(connection, "Unknown Connection type provided.");
  }
};

export const googleStorageClient = (connection: Connection) => {
  validateConnection(connection);

  const storageOptions: StorageOptions = {};
  const projectId = util.types.toString(connection.fields.projectId);

  if (connection.key === googleOAuthConnection.key) {
    if (!connection.token?.access_token) {
      throw new ConnectionError(
        connection,
        "Received valid OAuth Connection type but did not find valid access token."
      );
    }
    const oauth2Client = new OAuth2Client();
    const token = util.types.toString(connection.token.access_token);
    oauth2Client.setCredentials({
      access_token: token,
    });
    storageOptions.authClient = oauth2Client as any;
  } else {
    const clientEmail = util.types.toString(connection.fields.clientEmail);
    const privateKey = util.types
      .toString(connection.fields.privateKey)
      .replace(/\\n/g, "\n");

    storageOptions.credentials = {
      client_email: clientEmail,
      private_key: privateKey,
    };
  }

  return new Storage({
    ...storageOptions,
    projectId,
  });
};

export const getAccessToken = ({ connection }: CreateClientParams) => {
  validateConnection(connection);

  if (connection.token?.access_token) {
    return util.types.toString(connection.token.access_token);
  }

  return null;
};
