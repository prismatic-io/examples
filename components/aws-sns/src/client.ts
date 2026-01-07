import { SNSClient } from "@aws-sdk/client-sns";
import { ActionLogger, ConnectionError } from "@prismatic-io/spectral";
import {
  assumeRole,
  assumeRoleConnection,
  toOptionalString,
  toTrimmedString,
} from "aws-utils";
import { getCredentials } from "./helpers";
import type { ClientProps } from "./interfaces/ClientProps";

export const createSNSClient = async ({
  awsRegion,
  awsConnection,
  debug,
  logger,
}: ClientProps & {
  debug?: boolean;
  logger?: ActionLogger;
}): Promise<SNSClient> => {
  const { accessKeyId, secretAccessKey } = getCredentials(awsConnection);
  const shouldAssumeRole = awsConnection.key === assumeRoleConnection.key;

  const credentials = shouldAssumeRole
    ? await assumeRole(
        awsRegion,
        accessKeyId,
        secretAccessKey,
        toTrimmedString(awsConnection.fields.roleARN),
        toOptionalString(awsConnection.fields?.externalId)
      )
    : { accessKeyId, secretAccessKey };

  const region = awsRegion.length > 0 ? awsRegion : undefined;

  try {
    return new SNSClient({
      region,
      credentials,
      logger: debug ? logger : undefined,
    });
  } catch (err) {
    throw new ConnectionError(
      awsConnection,
      `Invalid AWS Credentials have been configured. This is sometimes caused by missing characters from a copy/paste. Original AWS error message: ${
        (err as Error).message
      }`
    );
  }
};
