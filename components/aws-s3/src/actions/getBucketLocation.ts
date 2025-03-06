import { GetBucketLocationCommand } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { createS3Client } from "../auth";
import { accessKeyInput, bucket } from "../inputs";
import { getBucketLocationPayload } from "../examplePayloads";
import { dynamicAccessAllInputs } from "aws-utils";

export const getBucketLocation = action({
  display: {
    label: "Get Bucket Location",
    description: "Get the location (AWS region) of a bucket by name",
  },
  perform: async (
    context,
    {
      accessKey,
      bucket,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    },
  ) => {
    const s3 = await createS3Client({
      awsConnection: accessKey,
      awsRegion: "",
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    });
    const command = new GetBucketLocationCommand({ Bucket: bucket });
    const response = await s3.send(command);
    return { data: response.LocationConstraint || "us-east-1" }; // This command returns null for us-east-1
  },
  inputs: { accessKey: accessKeyInput, ...dynamicAccessAllInputs, bucket },
  examplePayload: getBucketLocationPayload,
});
