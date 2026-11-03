import { EC2Client } from "@aws-sdk/client-ec2";
import { S3Client } from "@aws-sdk/client-s3";
import { Connection } from "@prismatic-io/spectral";

export const createEc2Client = (connection: Connection) => {
  const { accessKeyId, secretAccessKey } = connection.fields;
  return new EC2Client({
    credentials: {
      accessKeyId: `${accessKeyId}`,
      secretAccessKey: `${secretAccessKey}`,
    },
  });
};

export const createS3Client = (connection: Connection, region: string) => {
  const { accessKeyId, secretAccessKey } = connection.fields;
  return new S3Client({
    region,
    credentials: {
      accessKeyId: `${accessKeyId}`,
      secretAccessKey: `${secretAccessKey}`,
    },
  });
};
