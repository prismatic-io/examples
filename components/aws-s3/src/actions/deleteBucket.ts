import { DeleteBucketCommand } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { accessKeyInput, bucket } from "../inputs";
import { deleteBucketPayload } from "../examplePayloads";

export const deleteBucket = action({
  display: {
    label: "Delete Bucket",
    description:
      "Deletes the S3 bucket. All objects in the bucket must be deleted before the bucket itself can be deleted",
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

    const command = new DeleteBucketCommand({
      Bucket: bucket,
    });

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
  examplePayload: deleteBucketPayload,
});
