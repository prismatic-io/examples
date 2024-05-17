import { DeleteObjectsCommand, ObjectIdentifier } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { accessKeyInput, bucket, objectKeys } from "../inputs";
import { deleteObjectsPayload } from "../examplePayloads";

export const deleteObjects = action({
  display: {
    label: "Delete Objects",
    description: "Delete multiple objects from a bucket",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      bucket,
      objectKeys,
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
    const objects: ObjectIdentifier[] = objectKeys;
    const command = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: { Objects: objects },
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
    objectKeys,
  },
  examplePayload: deleteObjectsPayload,
});
