import { type Connection, ConnectionError } from "@prismatic-io/spectral";
import {
  type Credentials,
  assumeRoleConnection,
  toTrimmedString,
} from "aws-utils";
import { accessKeySecretPair } from "../connections";

export const validateConnection = (connection: Connection): void => {
  if (
    ![accessKeySecretPair.key, assumeRoleConnection.key].includes(
      connection.key,
    )
  ) {
    throw new ConnectionError(
      connection,
      `Unsupported connection method ${connection.key}.`,
    );
  }
};

export const getCredentials = (connection: Connection): Credentials => {
  validateConnection(connection);
  return {
    accessKeyId: toTrimmedString(connection.fields.accessKeyId),
    secretAccessKey: toTrimmedString(connection.fields.secretAccessKey),
  };
};
