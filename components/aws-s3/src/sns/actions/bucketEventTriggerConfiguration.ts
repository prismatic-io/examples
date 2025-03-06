import { action } from "@prismatic-io/spectral";
import { createS3Client } from "../../auth";
import {
  accessKeyInput,
  eventsList,
  snsTopicArn,
  bucket,
  eventNotificationName,
  bucketOwnerAccountid,
} from "../../inputs";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { processTopicConfiguration } from "../../utils";
import { Event, TopicConfiguration } from "@aws-sdk/client-s3";
import { bucketEventTriggerConfigurationPayload } from "../../examplePayloads";

export const bucketEventTriggerConfiguration = action({
  display: {
    label: "Bucket SNS Event Trigger Configuration",
    description: "Add events to send notifications to SNS Topic",
  },
  perform: async (
    context,
    {
      awsRegion,
      awsConnection,
      snsTopicArn,
      eventsList,
      bucket,
      eventNotificationName,
      bucketOwnerAccountid,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    },
  ) => {
    const s3Client = await createS3Client({
      awsConnection,
      awsRegion,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    });

    const topicConfiguration: TopicConfiguration = {
      Id: eventNotificationName,
      TopicArn: snsTopicArn,
      Events: eventsList as Event[],
    };

    return {
      data: await processTopicConfiguration(
        s3Client,
        bucket,
        bucketOwnerAccountid,
        eventNotificationName,
        topicConfiguration,
      ),
    };
  },
  inputs: {
    awsRegion,
    snsTopicArn,
    eventsList,
    awsConnection: accessKeyInput,
    ...dynamicAccessAllInputs,
    bucket,
    eventNotificationName,
    bucketOwnerAccountid,
  },
  examplePayload: bucketEventTriggerConfigurationPayload,
});
