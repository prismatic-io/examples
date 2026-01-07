import type { ReadStream } from "node:fs";
import querystring from "node:querystring";
import { PutObjectCommand, type PutObjectRequest } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { putObjectPayload } from "../examplePayloads";
import { accessKeyInput, acl, bucket, fileContents, objectKey, tagging } from "../inputs";

export const putObject = action({
  display: {
    label: "Put Object",
    description: "Write an object to S3",
  },
  perform: async (
    context,
    {
      acl,
      awsRegion,
      accessKey,
      bucket,
      fileContents,
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
      logger: context.logger,
      debug: context.debug.enabled,
    });
    const { data, contentType } = fileContents;
    const tagsObj: Record<string, string> = {};
    for (const { key, value } of tagging || []) {
      tagsObj[key as string] = value as string;
    }
    const tags = querystring.encode(tagsObj);
    const putParameters: PutObjectRequest = {
      ACL: acl || null,
      Bucket: bucket,
      Key: objectKey,
      Body: data as unknown as ReadStream,
      ContentType: contentType,
      Tagging: tags,
    };
    const command = new PutObjectCommand(putParameters);
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
    fileContents,
    objectKey,
    tagging,
    acl,
  },
  examplePayload: putObjectPayload,
});
