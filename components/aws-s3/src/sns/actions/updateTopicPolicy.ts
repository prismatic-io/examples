import { action } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import {
  awsRegion,
  accessKeyInput,
  bucket,
  snsTopicArn,
  bucketOwnerAccountid,
} from "../../inputs";
import {
  SetTopicAttributesCommand,
  SetTopicAttributesCommandInput,
} from "@aws-sdk/client-sns";

export const updateTopicPolicy = action({
  display: {
    label: "Update SNS Topic Policy For S3 Event Notification",
    description:
      "Update an Amazon SNS Topic Policy to grant S3 permission to publish",
  },
  perform: async (
    context,
    { awsConnection, awsRegion, snsTopicArn, bucketOwnerAccountid, bucket }
  ) => {
    const sns = createSNSClient({
      awsConnection: awsConnection,
      awsRegion,
    });

    const policy = {
      Version: "2012-10-17",
      Id: "example-ID",
      Statement: [
        {
          Sid: "Example SNS topic policy",
          Effect: "Allow",
          Principal: {
            Service: "s3.amazonaws.com",
          },
          Action: ["SNS:Publish"],
          Resource: snsTopicArn,
          Condition: {
            ArnLike: {
              "aws:SourceArn": `arn:aws:s3:*:*:${bucket}`,
            },
            StringEquals: {
              "aws:SourceAccount": bucketOwnerAccountid,
            },
          },
        },
      ],
    };

    const input: SetTopicAttributesCommandInput = {
      TopicArn: snsTopicArn,
      AttributeName: "Policy",
      AttributeValue: JSON.stringify(policy),
    };
    const command = new SetTopicAttributesCommand(input);
    const response = await sns.send(command);

    return {
      data: response,
    };
  },
  inputs: {
    awsRegion,
    awsConnection: accessKeyInput,
    bucket,
    snsTopicArn,
    bucketOwnerAccountid,
  },
});

export default updateTopicPolicy;
