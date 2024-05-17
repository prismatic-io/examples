import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import {
  accessKeyInput,
  bucket,
  objectKey,
  defaultRetentionMode,
  retainUntilDate,
  versionId,
} from "../inputs";
import { PutObjectRetentionCommand } from "@aws-sdk/client-s3";
import { putObjectRetentionPayload } from "../examplePayloads";

export const putObjectRetention = action({
  display: {
    label: "Put Object Retention",
    description: "Places an Object Retention configuration on an object",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      bucket,
      objectKey,
      retentionMode,
      retainUntilDate,
      versionId,
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

    const retentionModePresent = retentionMode.length > 0;
    const retainUntilDatePresent = retainUntilDate.length > 0;

    if (
      (retentionModePresent && !retainUntilDatePresent) ||
      (!retentionModePresent && retainUntilDatePresent)
    ) {
      throw new Error(
        "Both Retention Mode and Retain Until Date must be set when either is set."
      );
    }

    const command = new PutObjectRetentionCommand({
      Bucket: bucket,
      Key: objectKey,
      Retention: retentionModePresent
        ? {
            Mode: retentionMode, //requires RetainUntilDate when value is set
            RetainUntilDate: new Date(retainUntilDate), //requires Mode when value is set
          }
        : {},
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
    retentionMode: {
      ...defaultRetentionMode,
      label: "Retention Mode",
      comments:
        "Retention mode for the specified object. Required when Retain Until Date is set.",
    },
    retainUntilDate,
    versionId,
  },
  examplePayload: putObjectRetentionPayload,
});
