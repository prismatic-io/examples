import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { headObjectPayload } from "../examplePayloads";
import { accessKeyInput, bucket, objectKey } from "../inputs";

export const headObject = action({
  display: {
    label: "Head Object",
    description:
      "Retrieve metadata from an object without returning the object itself",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      bucket,
      objectKey,
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
    const command = new HeadObjectCommand({ Bucket: bucket, Key: objectKey });
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
    objectKey,
  },
  examplePayload: headObjectPayload,
});
