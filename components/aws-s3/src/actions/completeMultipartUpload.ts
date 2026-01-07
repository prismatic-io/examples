import { CompleteMultipartUploadCommand, type Part } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { completeMultipartUploadPayload } from "../examplePayloads";
import { accessKeyInput, bucket, objectKey, parts, uploadId } from "../inputs";

export const completeMultipartUpload = action({
  display: {
    label: "Complete Multipart Upload",
    description: "Complete a multipart upload",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      bucket,
      objectKey,
      uploadId,
      parts,
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
      logger: context.logger,
      debug: context.debug.enabled,
    });
    const command = new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: objectKey,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts as Part[] },
    });
    const result = await s3.send(command);
    return { data: result };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    ...dynamicAccessAllInputs,
    bucket,
    objectKey,
    uploadId,
    parts,
  },
  examplePayload: completeMultipartUploadPayload,
});
