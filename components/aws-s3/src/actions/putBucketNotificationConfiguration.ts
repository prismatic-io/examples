import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import {
  accessKeyInput,
  bucket,
  lambdaFunctionConfigurations,
  queueConfigurations,
  topicConfigurations,
  eventBridgeConfiguration,
} from "../inputs";
import { putBucketNotificationConfiguration as putBucketNotificationConfigurationFn } from "../utils";
import { NotificationConfiguration } from "@aws-sdk/client-s3";
import { putBucketNotificationConfigurationPayload } from "../examplePayloads";

export const putBucketNotificationConfiguration = action({
  display: {
    label: "Put Bucket Notification Configuration",
    description:
      "Replace an existing bucket notification configuration with a new one",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      bucket,
      topicConfigurations,
      queueConfigurations,
      lambdaFunctionConfigurations,
      eventBridgeConfiguration,
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
    const notificationConfiguration: NotificationConfiguration = {
      TopicConfigurations: topicConfigurations,
      QueueConfigurations: queueConfigurations,
      LambdaFunctionConfigurations: lambdaFunctionConfigurations,
      EventBridgeConfiguration: eventBridgeConfiguration,
    };
    const data = await putBucketNotificationConfigurationFn(
      s3,
      bucket,
      notificationConfiguration,
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
    topicConfigurations,
    queueConfigurations,
    lambdaFunctionConfigurations,
    eventBridgeConfiguration,
  },
  examplePayload: putBucketNotificationConfigurationPayload,
});
