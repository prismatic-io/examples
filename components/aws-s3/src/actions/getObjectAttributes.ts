import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import {
  accessKeyInput,
  bucket,
  objectAttributes,
  objectKey,
  versionId,
} from "../inputs";
import { GetObjectAttributesCommand } from "@aws-sdk/client-s3";
import { getObjectAttributesPayload } from "../examplePayloads";

export const getObjectAttributes = action({
  display: {
    label: "Get Object Attributes",
    description:
      "Retrieves all the metadata from an object without returning the object itself",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      bucket,
      objectKey,
      versionId,
      objectAttributes,
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
    const command = new GetObjectAttributesCommand({
      Bucket: bucket,
      Key: objectKey,
      ObjectAttributes: objectAttributes,
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
    objectAttributes,
    versionId: {
      ...versionId,
      comments:
        "The version ID for the object whose metadata you want to retrieve.",
    },
  },
  examplePayload: getObjectAttributesPayload,
});
