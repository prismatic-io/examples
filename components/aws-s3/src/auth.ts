import { S3Client } from "@aws-sdk/client-s3";
import { Connection, ConnectionError, util } from "@prismatic-io/spectral";

export const createS3Client = (
  accessKey: Connection,
  region: string
): S3Client => {
  if (accessKey.key !== "apiKeySecret") {
    throw new ConnectionError(
      accessKey,
      `Unsupported connection method ${accessKey.key}.`
    );
  }
  try {
    return new S3Client({
      region: region,
      credentials: {
        accessKeyId: util.types.toString(accessKey.fields.accessKeyId).trim(),
        secretAccessKey: util.types
          .toString(accessKey.fields.secretAccessKey)
          .trim(),
      },
    });
  } catch (error) {
    throw new ConnectionError(
      accessKey,
      `Invalid AWS Credentials have been configured. This is sometimes caused by missing characters from a copy/paste. Original AWS error message: ${
        (error as Error).message
      }`
    );
  }
};
