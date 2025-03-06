import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { accessKeyInput, bucket } from "../inputs";
import { GetObjectLockConfigurationCommand } from "@aws-sdk/client-s3";
import { getObjectLockConfigurationPayload } from "../examplePayloads";

export const getObjectLockConfiguration = action({
  display: {
    label: "Get Object Lock Configuration",
    description: "Gets the Object Lock configuration for a bucket",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      bucket,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    },
  ) => {
    const s3 = await createS3Client({
      awsConnection: accessKey,
      awsRegion,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    });
    const command = new GetObjectLockConfigurationCommand({
      Bucket: bucket,
    });
    const data = await s3.send(command);

    return {
      data,
    };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    ...dynamicAccessAllInputs,
    bucket,
  },
  examplePayload: getObjectLockConfigurationPayload,
});
