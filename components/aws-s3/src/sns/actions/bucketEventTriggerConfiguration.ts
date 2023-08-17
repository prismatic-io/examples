import { action } from "@prismatic-io/spectral";
import {
  PutBucketNotificationConfigurationCommand,
  PutBucketNotificationConfigurationCommandInput,
} from "@aws-sdk/client-s3";
import { createS3Client } from "../client";
import {
  accessKeyInput,
  awsRegion,
  eventsList,
  snsTopicArn,
  bucket,
  eventNotificationName,
} from "../../inputs";

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
    }
  ) => {
    const sns = createS3Client({
      awsConnection,
      awsRegion,
    });

    const input: PutBucketNotificationConfigurationCommandInput = {
      Bucket: bucket,
      NotificationConfiguration: {
        TopicConfigurations: [
          {
            Id: eventNotificationName,
            TopicArn: snsTopicArn,
            Events: eventsList,
          },
        ],
      },
    };
    const command = new PutBucketNotificationConfigurationCommand(input);

    const response = await sns.send(command);

    return {
      data: response,
    };
  },
  inputs: {
    awsRegion,
    snsTopicArn,
    eventsList,
    awsConnection: accessKeyInput,
    bucket,
    eventNotificationName,
  },
});

export default bucketEventTriggerConfiguration;
