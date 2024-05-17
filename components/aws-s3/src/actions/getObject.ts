import { GetObjectCommand } from "@aws-sdk/client-s3";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { accessKeyInput, bucket, objectKey } from "../inputs";
import { getObjectPayload } from "../examplePayloads";

export const getObject = action({
  display: {
    label: "Get Object",
    description: "Get the contents of an object",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      bucket,
      objectKey,
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
    const getObjectParameters = {
      Bucket: bucket,
      Key: objectKey,
    };
    const command = new GetObjectCommand(getObjectParameters);
    const response = await s3.send(command);
    const objectBodyAsArray = await response.Body.transformToByteArray();
    const objectAsABuffer = Buffer.from(objectBodyAsArray);

    return {
      data: objectAsABuffer,
      contentType: response.ContentType,
    };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    ...dynamicAccessAllInputs,
    bucket,
    objectKey,
  },
  examplePayload: getObjectPayload,
});
