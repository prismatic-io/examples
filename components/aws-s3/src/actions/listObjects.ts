import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { listObjectsPayload } from "../examplePayloads";
import {
  accessKeyInput,
  bucket,
  prefix,
  maxKeys,
  continuationToken,
  includeMetadata,
} from "../inputs";

export const listObjects = action({
  display: {
    label: "List Objects",
    description: "List Objects in a Bucket",
  },
  perform: async (context, params) => {
    const s3 = await createS3Client({
      awsConnection: params.accessKey,
      awsRegion: params.awsRegion,
      dynamicAccessKeyId: params.dynamicAccessKeyId,
      dynamicSecretAccessKey: params.dynamicSecretAccessKey,
      dynamicSessionToken: params.dynamicSessionToken,
    });

    const listObjectsV2Params = {
      Bucket: params.bucket,
      Prefix: params.prefix,
      MaxKeys: params.maxKeys || undefined,
      ContinuationToken: params.continuationToken || undefined,
    };
    const command = new ListObjectsV2Command(listObjectsV2Params);
    const response = await s3.send(command);
    return {
      data: params.includeMetadata
        ? response
        : (response.Contents || []).map(({ Key }) => Key),
    };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    ...dynamicAccessAllInputs,
    bucket,
    prefix,
    maxKeys,
    continuationToken,
    includeMetadata,
  },
  examplePayload: listObjectsPayload,
});
