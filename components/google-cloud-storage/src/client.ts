import { Storage } from "@google-cloud/storage";
import { Connection } from "@prismatic-io/spectral";
import { getProjectId, getStorageOptions, validateConnection } from "./util";
import {
  createClient,
  HttpClient,
} from "@prismatic-io/spectral/dist/clients/http";

export const googleStorageClient = (connection: Connection) => {
  validateConnection(connection);

  const storageOptions = getStorageOptions(connection);
  const projectId = getProjectId(connection);

  return new Storage({
    ...storageOptions,
    projectId,
  });
};

export const googleHttpClient = async (
  connection: Connection,
  bucketName: string
): Promise<HttpClient> => {
  validateConnection(connection);
  const storageOptions = getStorageOptions(connection, true);
  const token = await storageOptions.authClient.getAccessToken();

  return createClient({
    baseUrl: `https://storage.googleapis.com/${bucketName}`,
    debug: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
