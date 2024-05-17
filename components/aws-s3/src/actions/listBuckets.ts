import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { accessKeyInput } from "../inputs";
import { listBucketsPayload } from "../examplePayloads";

export const listBuckets = action({
  display: {
    label: "List Buckets",
    description: "List all buckets in an AWS account",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    }
  ) => {
    const s3 = await createS3Client({
      awsConnection: accessKey,
      awsRegion,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    });
    const command = new ListBucketsCommand({});
    const response = await s3.send(command);
    return {
      data: response.Buckets,
    };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    ...dynamicAccessAllInputs,
  },
  examplePayload: listBucketsPayload,
});
