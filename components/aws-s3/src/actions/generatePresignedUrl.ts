import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import {
  accessKeyInput,
  bucket,
  objectKey,
  actionType,
  expirationSeconds,
} from "../inputs";
import { generatePresignedUrlPayload } from "../examplePayloads";

export const generatePresignedUrl = action({
  display: {
    label: "Generate Presigned URL",
    description:
      "Generate a presigned URL that can be used to upload or download an object in S3",
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    ...dynamicAccessAllInputs,
    bucket,
    objectKey,
    actionType,
    expirationSeconds,
  },
  perform: async (context, params) => {
    const s3 = await createS3Client({
      awsConnection: params.accessKey,
      awsRegion: params.awsRegion,
      dynamicAccessKeyId: params.dynamicAccessKeyId,
      dynamicSecretAccessKey: params.dynamicSecretAccessKey,
      dynamicSessionToken: params.dynamicSessionToken,
    });
    const command =
      params.actionType === "download"
        ? new GetObjectCommand({
            Bucket: params.bucket,
            Key: params.objectKey,
          })
        : new PutObjectCommand({
            Bucket: params.bucket,
            Key: params.objectKey,
          });
    return {
      data: await getSignedUrl(s3, command, {
        expiresIn: params.expirationSeconds,
      }),
    };
  },
  examplePayload: generatePresignedUrlPayload,
});
