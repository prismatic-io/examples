import { UploadPartCommand } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import {
  accessKeyInput,
  bucket,
  objectKey,
  uploadId,
  partNumber,
  fileChunk,
} from "../inputs";
import { uploadPartPayload } from "../examplePayloads";

export const uploadPart = action({
  display: {
    label: "Upload Part",
    description: "Upload a chunk of a multipart file upload",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      bucket,
      fileChunk,
      objectKey,
      uploadId,
      partNumber,
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
    const command = new UploadPartCommand({
      Bucket: bucket,
      Key: objectKey,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: fileChunk,
    });
    const result = await s3.send(command);
    return {
      data: {
        ...result,
        part: { ETag: result.ETag, PartNumber: partNumber },
      },
    };
  },
  inputs: {
    accessKey: accessKeyInput,
    ...dynamicAccessAllInputs,
    awsRegion,
    bucket,
    objectKey,
    uploadId,
    partNumber,
    fileChunk,
  },
  examplePayload: uploadPartPayload,
});
