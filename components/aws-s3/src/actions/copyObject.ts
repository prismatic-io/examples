import { CopyObjectCommandInput, CopyObjectCommand } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import {
  accessKeyInput,
  sourceBucket,
  destinationBucket,
  sourceKey,
  destinationKey,
  acl,
} from "../inputs";
import { copyObjectPayload } from "../examplePayloads";

export const copyObject = action({
  display: {
    label: "Copy Object",
    description: "Copy an object in S3 from one location to another",
  },
  perform: async (
    context,
    {
      acl,
      awsRegion,
      accessKey,
      sourceBucket,
      destinationBucket,
      sourceKey,
      destinationKey,
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
    const copyParameters: CopyObjectCommandInput = {
      ACL: acl || null,
      Bucket: destinationBucket,
      CopySource: `${sourceBucket}/${sourceKey}`,
      Key: destinationKey,
    };
    const command = new CopyObjectCommand(copyParameters);
    const response = await s3.send(command);
    return {
      data: response,
    };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    ...dynamicAccessAllInputs,
    sourceBucket,
    destinationBucket,
    sourceKey,
    destinationKey,
    acl,
  },
  examplePayload: copyObjectPayload,
});
