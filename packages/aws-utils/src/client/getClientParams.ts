import { assumeRole } from "../connection/assumeRole";
import { assumeRoleConnection } from "../connection/assumeRoleConnection";
import { getCredentials } from "../helpers/getCredentials";
import { toTrimmedString } from "../helpers/misc";
import { validateConnection } from "../helpers/validateConnection";
import { Credentials } from "../interfaces/Credentials";
import { GetClientParamsProps } from "../interfaces/GetClientParamsProps";

export const getClientParams = async ({
  awsRegion,
  awsConnection,
  validConnectionKeys,
  dynamicAccessKeyId,
  dynamicSecretAccessKey,
  dynamicSessionToken,
}: GetClientParamsProps): Promise<{
  region: string | undefined;
  credentials: Credentials;
}> => {
  let shouldAssumeRole = false;
  if (awsConnection) {
    validateConnection(awsConnection, validConnectionKeys);
    if (dynamicAccessKeyId || dynamicSecretAccessKey) {
      throw new Error(
        "Please specify either a connection or dynamic access key and secret inputs.",
      );
    }
    shouldAssumeRole = awsConnection.key === assumeRoleConnection.key;
  }

  if (!awsConnection && (!dynamicAccessKeyId || !dynamicSecretAccessKey)) {
    throw new Error(
      "You must specify either a connection input or dynamic access key and secret inputs.",
    );
  }

  const { accessKeyId, secretAccessKey }: Credentials = awsConnection
    ? getCredentials(awsConnection)
    : {
        accessKeyId: dynamicAccessKeyId,
        secretAccessKey: dynamicSecretAccessKey,
      };

  const credentials: Credentials = shouldAssumeRole
    ? await assumeRole(
        awsRegion,
        accessKeyId,
        secretAccessKey,
        toTrimmedString(awsConnection.fields.roleARN),
      )
    : {
        accessKeyId,
        secretAccessKey,
        sessionToken: dynamicSessionToken,
      };

  const region: string | undefined =
    awsRegion.length > 0 ? awsRegion : undefined;
  return { region, credentials };
};
