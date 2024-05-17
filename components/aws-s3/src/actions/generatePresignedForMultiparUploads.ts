import { UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import {
  accessKeyInput,
  bucket,
  objectKey,
  urlsToGenerate,
  uploadId,
  expirationSeconds,
} from "../inputs";
import { generatePresignedForMultiparUploadsPayload } from "../examplePayloads";

export const generatePresignedForMultiparUploads = action({
  display: {
    label: "Generate Presigned URL for Multipart Uploads",
    description:
      "Generate presigned URL's that can be used to upload or download an object in S3",
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    ...dynamicAccessAllInputs,
    bucket,
    objectKey,
    urlsToGenerate,
    uploadId,
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
    const urlArray = [];
    for (let i = 1; i <= params.urlsToGenerate; i++) {
      const command = new UploadPartCommand({
        Bucket: params.bucket,
        Key: params.objectKey,
        PartNumber: i,
        UploadId: params.uploadId,
      });
      urlArray.push(
        getSignedUrl(s3, command, {
          expiresIn: params.expirationSeconds,
        })
      );
    }

    const urls = await Promise.all(urlArray);

    return {
      data: urls.map((value, index) => ({
        url: value,
        partNumber: index + 1,
      })),
    };
  },
  examplePayload: generatePresignedForMultiparUploadsPayload,
});
