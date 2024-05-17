import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { accessKeyInput, bucket } from "../inputs";
import { getBucketNotificationConfiguration as getBucketNotificationConfigurationFn } from "../utils";
import { getBucketNotificationConfigurationPayload } from "../examplePayloads";

export const getBucketNotificationConfiguration = action({
  display: {
    label: "Get Bucket Notification Configuration",
    description: "Returns the notification configuration of a bucket",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      bucket,
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
    const data = await getBucketNotificationConfigurationFn(
      s3,
      bucket,
      undefined,
      false
    );
    return {
      data,
    };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    ...dynamicAccessAllInputs,
    bucket,
  },
  examplePayload: getBucketNotificationConfigurationPayload,
});
