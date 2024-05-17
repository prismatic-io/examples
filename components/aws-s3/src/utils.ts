import {
  GetBucketNotificationConfigurationCommandInput,
  GetBucketNotificationConfigurationCommand,
  NotificationConfiguration,
  S3Client,
  TopicConfiguration,
  PutBucketNotificationConfigurationCommandInput,
  PutBucketNotificationConfigurationCommand,
  PutBucketNotificationConfigurationCommandOutput,
  ObjectIdentifier,
  QueueConfiguration,
  LambdaFunctionConfiguration,
  EventBridgeConfiguration,
  ObjectAttributes,
} from "@aws-sdk/client-s3";
import querystring from "querystring";
import {
  LAMBDA_FUNCTION_CONFIGURATIONS_EXAMPLE,
  QUEUE_CONFIGURATIONS_EXAMPLE,
  TOPIC_CONFIGURATIONS_EXAMPLE,
} from "./constants";
import { KeyValuePair, util } from "@prismatic-io/spectral";

export const getBucketNotificationConfiguration = async (
  s3Client: S3Client,
  bucket: string,
  bucketOwnerAccountid?: string,
  removeMetadata = true
): Promise<NotificationConfiguration> => {
  const getBucketNotificationConfigurationCommandInput: GetBucketNotificationConfigurationCommandInput = {
    Bucket: bucket,
    ExpectedBucketOwner: bucketOwnerAccountid,
  };

  const getBucketNotificationConfigurationCommand = new GetBucketNotificationConfigurationCommand(
    getBucketNotificationConfigurationCommandInput
  );
  // Get the existing notification configuration for the bucket
  const getBucketNotificationConfigurationCommandOutput = await s3Client.send(
    getBucketNotificationConfigurationCommand
  );

  // Remove the metadata from the response
  if (removeMetadata)
    delete getBucketNotificationConfigurationCommandOutput.$metadata;

  return getBucketNotificationConfigurationCommandOutput;
};

export const putBucketNotificationConfiguration = async (
  s3Client: S3Client,
  bucket: string,
  notificationConfiguration: NotificationConfiguration
): Promise<PutBucketNotificationConfigurationCommandOutput> => {
  const putBucketNotificationConfigurationCommandInput: PutBucketNotificationConfigurationCommandInput = {
    Bucket: bucket,
    NotificationConfiguration: notificationConfiguration,
    SkipDestinationValidation: true,
  };
  const putBucketNotificationConfigurationCommand = new PutBucketNotificationConfigurationCommand(
    putBucketNotificationConfigurationCommandInput
  );
  const putBucketNotificationConfigurationCommandOutput = await s3Client.send(
    putBucketNotificationConfigurationCommand
  );
  return putBucketNotificationConfigurationCommandOutput;
};

export const processTopicConfiguration = async (
  s3Client: S3Client,
  bucket: string,
  bucketOwnerAccountid: string,
  eventNotificationName: string,
  topicConfiguration: TopicConfiguration
): Promise<PutBucketNotificationConfigurationCommandOutput> => {
  const notificationConfiguration = await getBucketNotificationConfiguration(
    s3Client,
    bucket,
    bucketOwnerAccountid
  );

  if (!("TopicConfigurations" in notificationConfiguration))
    notificationConfiguration.TopicConfigurations = [];

  //Check if the topic configuration already exists
  let existingTopicConfigurationIndex = -1;
  notificationConfiguration.TopicConfigurations.find(
    (topicConfiguration, index) => {
      const topicConfigurationIdEqualsEventNotificationName =
        topicConfiguration.Id === eventNotificationName;

      if (topicConfigurationIdEqualsEventNotificationName)
        existingTopicConfigurationIndex = index;

      return topicConfigurationIdEqualsEventNotificationName;
    }
  );

  if (existingTopicConfigurationIndex === -1) {
    //Add a new topic configuration
    notificationConfiguration.TopicConfigurations.push(topicConfiguration);
  } else {
    //Replace the existing topic configuration
    notificationConfiguration.TopicConfigurations[
      existingTopicConfigurationIndex
    ] = topicConfiguration;
  }

  return await putBucketNotificationConfiguration(
    s3Client,
    bucket,
    notificationConfiguration
  );
};

export const getObjectIdentifiers = (
  objectKeys: unknown
): ObjectIdentifier[] => {
  if (Array.isArray(objectKeys)) {
    return objectKeys.map((key) => ({ Key: key }));
  }
  return [];
};

export const getTopicConfigurations = (
  topicConfigurations: unknown
): TopicConfiguration[] => {
  if (
    typeof topicConfigurations === "string" &&
    topicConfigurations.length > 0
  ) {
    const topicConfigurationsJson = JSON.parse(topicConfigurations);
    if (!Array.isArray(topicConfigurationsJson))
      throw new Error(
        `Topic configurations must be an array with the following structure: ${JSON.stringify(
          TOPIC_CONFIGURATIONS_EXAMPLE
        )}`
      );
    return topicConfigurationsJson;
  }

  return undefined;
};

export const getQueueConfigurations = (
  queueConfigurations: unknown
): QueueConfiguration[] => {
  if (
    typeof queueConfigurations === "string" &&
    queueConfigurations.length > 0
  ) {
    const queueConfigurationsJson = JSON.parse(queueConfigurations);
    if (!Array.isArray(queueConfigurationsJson))
      throw new Error(
        `Queue configurations must be an array with the following structure: ${JSON.stringify(
          QUEUE_CONFIGURATIONS_EXAMPLE
        )}`
      );
    return queueConfigurationsJson;
  }

  return undefined;
};

export const getLambdaFunctionConfigurations = (
  lambdaFunctionConfigurations: unknown
): LambdaFunctionConfiguration[] => {
  if (
    typeof lambdaFunctionConfigurations === "string" &&
    lambdaFunctionConfigurations.length > 0
  ) {
    const lambdaFunctionConfigurationsJson = JSON.parse(
      lambdaFunctionConfigurations
    );
    if (!Array.isArray(lambdaFunctionConfigurationsJson))
      throw new Error(
        `Lambda function configurations must be an array with the following structure: ${JSON.stringify(
          LAMBDA_FUNCTION_CONFIGURATIONS_EXAMPLE
        )}`
      );
    return lambdaFunctionConfigurationsJson;
  }

  return undefined;
};

export const getEventBridgeConfiguration = (
  eventBridgeConfiguration: unknown
): EventBridgeConfiguration => {
  if (
    typeof eventBridgeConfiguration === "string" &&
    eventBridgeConfiguration.length > 0
  ) {
    return JSON.parse(eventBridgeConfiguration);
  }

  return undefined;
};

export const getObjectAttributes = (
  attributes: unknown
): ObjectAttributes[] => {
  if (Array.isArray(attributes)) {
    if (attributes.length === 0) {
      throw new Error("Object Attributes must contain at least one attribute");
    }
    return attributes as ObjectAttributes[];
  }
};

export const encodeTags = (tags: KeyValuePair[]): string => {
  return querystring.encode(
    (tags || []).reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
  );
};
