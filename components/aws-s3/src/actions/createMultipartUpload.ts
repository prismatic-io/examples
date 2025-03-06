import { CreateMultipartUploadCommand } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { accessKeyInput, bucket, objectKey, tagging, acl } from "../inputs";
import { encodeTags } from "../utils";
import { createMultipartUploadPayload } from "../examplePayloads";

export const createMultipartUpload = action({
  display: {
    label: "Create Multipart Upload",
    description: "Create a multipart upload",
  },
  perform: async (
    context,
    {
      acl,
      awsRegion,
      accessKey,
      bucket,
      objectKey,
      tagging,
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
    const command = new CreateMultipartUploadCommand({
      ACL: acl || null,
      Bucket: bucket,
      Key: objectKey,
      Tagging: encodeTags(tagging),
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
    tagging,
    acl,
  },
  examplePayload: createMultipartUploadPayload,
});
