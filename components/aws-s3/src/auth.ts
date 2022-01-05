import { S3, STS } from "aws-sdk";
import { Connection, ConnectionError, util } from "@prismatic-io/spectral";

export const createS3Client = async (accessKey: Connection, region: string) => {
  const credentials: STS.Types.ClientConfiguration = {
    accessKeyId: util.types.toString(accessKey.fields.accessKeyId),
    secretAccessKey: util.types.toString(accessKey.fields.secretAccessKey),
    region,
  };

  // Verify credentials are valid with STS.getCallerIdentity()
  const sts = new STS(credentials);
  try {
    await sts.getCallerIdentity({}).promise();
  } catch (err) {
    throw new ConnectionError(
      accessKey,
      `Invalid AWS Credentials have been configured. This is sometimes caused by trailing spaces in AWS keys, missing characters from a copy/paste, etc. Original AWS error message: ${
        (err as Error).message
      }`
    );
  }

  return new S3(credentials);
};
