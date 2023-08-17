import { SNSClient } from "@aws-sdk/client-sns";
import { util } from "@prismatic-io/spectral";
import { Connection, ConnectionError } from "@prismatic-io/spectral";

interface ClientProps {
  awsRegion: string;
  awsConnection: Connection;
}

export const createSNSClient = ({ awsRegion, awsConnection }: ClientProps) => {
  if (awsConnection.key !== "apiKeySecret") {
    throw new ConnectionError(
      awsConnection,
      `Unsupported connection method ${awsConnection.key}.`
    );
  }
  try {
    return new SNSClient({
      region: awsRegion,
      credentials: {
        accessKeyId: util.types
          .toString(awsConnection.fields.accessKeyId)
          .trim(),
        secretAccessKey: util.types
          .toString(awsConnection.fields.secretAccessKey)
          .trim(),
      },
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
