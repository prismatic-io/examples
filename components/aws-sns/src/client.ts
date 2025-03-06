import { SNSClient } from "@aws-sdk/client-sns";
import { ConnectionError } from "@prismatic-io/spectral";
import { assumeRoleConnection, assumeRole } from "aws-utils";
import { getCredentials, toTrimmedString } from "./helpers";
import { ClientProps } from "./interfaces/ClientProps";

export const createSNSClient = async ({
  awsRegion,
  awsConnection,
}: ClientProps): Promise<SNSClient> => {
  const { accessKeyId, secretAccessKey } = getCredentials(awsConnection);
  const shouldAssumeRole = awsConnection.key === assumeRoleConnection.key;

  const credentials = shouldAssumeRole
    ? await assumeRole(
        awsRegion,
        accessKeyId,
        secretAccessKey,
        toTrimmedString(awsConnection.fields.roleARN),
      )
    : { accessKeyId, secretAccessKey };

  const region = awsRegion.length > 0 ? awsRegion : undefined;

  try {
    return new SNSClient({
      region,
      credentials,
    });
  } catch (err) {
    throw new ConnectionError(
      awsConnection,
      `Invalid AWS Credentials have been configured. This is sometimes caused by missing characters from a copy/paste. Original AWS error message: ${
        (err as Error).message
      }`,
    );
  }
};
