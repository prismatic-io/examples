import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { accessKeyInput, bucket, objectKey, versionId } from "../inputs";
import { GetObjectRetentionCommand } from "@aws-sdk/client-s3";
import { getObjectRetentionPayload } from "../examplePayloads";

export const getObjectRetention = action({
  display: {
    label: "Get Object Retention",
    description: "Retrieves an object's retention settings",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      bucket,
      objectKey,
      versionId,
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
    const command = new GetObjectRetentionCommand({
      Bucket: bucket,
      Key: objectKey,
      VersionId: versionId || undefined,
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
    objectKey,
    versionId: {
      ...versionId,
      comments:
        "The version ID for the object whose retention settings you want to retrieve.",
    },
  },
  examplePayload: getObjectRetentionPayload,
});
