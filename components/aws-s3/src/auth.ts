import { SNSClient } from "@aws-sdk/client-sns";
import { S3Client } from "@aws-sdk/client-s3";
import { Connection, ConnectionError } from "@prismatic-io/spectral";
import { getClientParams, ClientProps } from "aws-utils";
import { accessKeySecretPair } from "./connections";

const throwConnectionError = (connection: Connection, error: Error): void => {
  throw new ConnectionError(
    connection,
    `Invalid AWS Credentials have been configured. This is sometimes caused by missing characters from a copy/paste. Original AWS error message: ${error.message}`
  );
};

export const createS3Client = async ({
  awsRegion,
  awsConnection,
  dynamicAccessKeyId,
  dynamicSecretAccessKey,
  dynamicSessionToken,
}: ClientProps): Promise<S3Client> => {
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
}: ClientProps): Promise<SNSClient> => {
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
    });
  } catch (error) {
    throwConnectionError(awsConnection, error as Error);
  }
};

export default { createS3Client, createSNSClient };
