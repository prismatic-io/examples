import { Connection, ConnectionError } from "@prismatic-io/spectral";
import { assumeRoleConnection } from "../connection/assumeRoleConnection";

export const validateConnection = (
  connection: Connection,
  validConnectionKeys: string[],
): void => {
  if (
    ![assumeRoleConnection.key, ...validConnectionKeys].includes(connection.key)
  ) {
    throw new ConnectionError(
      connection,
      `Unsupported connection method ${connection.key}.`,
    );
  }
};
