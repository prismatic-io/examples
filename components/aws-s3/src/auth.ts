import { S3Client } from "@aws-sdk/client-s3";
import { SNSClient } from "@aws-sdk/client-sns";
import { type ActionLogger, type Connection, ConnectionError } from "@prismatic-io/spectral";
import { type ClientProps, getClientParams } from "aws-utils";
import { accessKeySecretPair } from "./connections";

const throwConnectionError = (connection: Connection, error: Error): void => {
  throw new ConnectionError(
    connection,
    `Invalid AWS Credentials have been configured. This is sometimes caused by missing characters from a copy/paste. Original AWS error message: ${error.message}`,
  );
};

export const createS3Client = async ({
  awsRegion,
  awsConnection,
  dynamicAccessKeyId,
  dynamicSecretAccessKey,
  dynamicSessionToken,
  debug,
  logger,
}: ClientProps & { debug?: boolean; logger?: ActionLogger }): Promise<S3Client> => {
  const { region, credentials } = await getClientParams({
    awsRegion,
    awsConnection,
    validConnectionKeys: [accessKeySecretPair.key],
    dynamicAccessKeyId,
    dynamicSecretAccessKey,
    dynamicSessionToken,
  });

  try {
    return new S3Client({
      region,
      credentials,
      logger: debug ? logger : undefined,
    });
  } catch (error) {
    throwConnectionError(awsConnection, error as Error);
  }
};

export const createSNSClient = async ({
  awsRegion,
  awsConnection,
  dynamicAccessKeyId,
  dynamicSecretAccessKey,
  dynamicSessionToken,
  logger,
  debug,
}: ClientProps & { debug?: boolean; logger?: ActionLogger }): Promise<SNSClient> => {
  const { region, credentials } = await getClientParams({
    awsRegion,
    awsConnection,
    validConnectionKeys: [accessKeySecretPair.key],
    dynamicAccessKeyId,
    dynamicSecretAccessKey,
    dynamicSessionToken,
  });

  try {
    return new SNSClient({
      region,
      credentials,
      logger: debug ? logger : undefined,
    });
  } catch (error) {
    throwConnectionError(awsConnection, error as Error);
  }
};

export default { createS3Client, createSNSClient };
