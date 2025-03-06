import { PutObjectRequest, PutObjectCommand } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import querystring from "querystring";
import {
  accessKeyInput,
  bucket,
  fileContents,
  objectKey,
  tagging,
  acl,
} from "../inputs";
import { putObjectPayload } from "../examplePayloads";
import { ReadStream } from "fs";

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
    });
    const { data, contentType } = fileContents;
    const tags = querystring.encode(
      (tagging || []).reduce(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {},
      ),
    );
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
