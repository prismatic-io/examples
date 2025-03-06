import { accessKeySecretPair } from "../connections";
import { assumeRoleConnection, Credentials } from "aws-utils";
import { Connection, ConnectionError, util } from "@prismatic-io/spectral";

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

export const toTrimmedString = (value: unknown): string =>
  util.types.toString(value).trim();

export const getCredentials = (connection: Connection): Credentials => {
  validateConnection(connection);
  return {
    accessKeyId: toTrimmedString(connection.fields.accessKeyId),
    secretAccessKey: toTrimmedString(connection.fields.secretAccessKey),
  };
};
