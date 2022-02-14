import AWS from "aws-sdk";
import { util } from "@prismatic-io/spectral";
import { Connection, ConnectionError } from "@prismatic-io/spectral";

interface ClientProps {
  awsRegion: unknown;
  awsConnection: Connection;
}

export const createSNSClient = async ({
  awsRegion,
  awsConnection,
}: ClientProps) => {
  if (awsConnection.key !== "apiKeySecret") {
    throw new ConnectionError(
      awsConnection,
      `Unsupported connection method ${awsConnection.key}.`
    );
  }

  const credentials = {
    accessKeyId: util.types.toString(awsConnection.fields.accessKeyId),
    secretAccessKey: util.types.toString(awsConnection.fields.secretAccessKey),
    region: util.types.toString(awsRegion),
  };

  const sts = new AWS.STS(credentials);
  try {
    await sts.getCallerIdentity({}).promise();
  } catch (err) {
    throw new ConnectionError(
      awsConnection,
      `Invalid AWS Credentials have been configured. This is sometimes caused by trailing spaces in AWS keys, missing characters from a copy/paste, etc. Original AWS error message: ${err.message}`
    );
  }

  return new AWS.SNS(credentials);
};
