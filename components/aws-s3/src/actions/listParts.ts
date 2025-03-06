import { ListPartsCommand } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { accessKeyInput, bucket, objectKey, uploadId } from "../inputs";
import { listPartsPayload } from "../examplePayloads";

export const listParts = action({
  display: {
    label: "List Parts",
    description: "List parts of a multipart upload",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      bucket,
      objectKey,
      uploadId,
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
    const command = new ListPartsCommand({
      Bucket: bucket,
      Key: objectKey,
      UploadId: uploadId,
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
  },
  examplePayload: listPartsPayload,
});
