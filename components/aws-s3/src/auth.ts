import { S3, STS } from "aws-sdk";
import { Connection, ConnectionError, util } from "@prismatic-io/spectral";

export const createS3Client = async (accessKey: Connection, region: string) => {
  const credentials: STS.Types.ClientConfiguration = {
    accessKeyId: util.types.toString(accessKey.fields.accessKeyId).trim(),
    secretAccessKey: util.types
      .toString(accessKey.fields.secretAccessKey)
      .trim(),
    region,
  };

  // Verify credentials are valid with STS.getCallerIdentity()
  const sts = new STS(credentials);
  try {
    await sts.getCallerIdentity({}).promise();
  } catch (err) {
    throw new ConnectionError(
      accessKey,
      `Invalid AWS Credentials have been configured. This is sometimes caused by missing characters from a copy/paste. Original AWS error message: ${
        (err as Error).message
      }`
    );
  }

  return new S3(credentials);
};
