import { HeadBucketCommand } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { headBucketPayload } from "../examplePayloads";
import { accessKeyInput, bucket } from "../inputs";

export const headBucket = action({
  display: {
    label: "Head Bucket",
    description: "Determine if a bucket exists and if you have permission to access it",
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
      logger: context.logger,
      debug: context.debug.enabled,
    });
    const command = new HeadBucketCommand({ Bucket: bucket });
    const response = await s3.send(command);
    return {
      data: response,
    };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    ...dynamicAccessAllInputs,
    bucket,
  },
  examplePayload: headBucketPayload,
});
