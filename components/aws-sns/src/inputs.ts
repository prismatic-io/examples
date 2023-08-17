import { input } from "@prismatic-io/spectral";
import awsRegions from "./aws-regions.json";

export const awsRegion = input({
  label: "AWS Region",
  placeholder: "AWS Region",
  type: "string",
  required: true,
  comments:
    "AWS provides services in multiple regions, like us-west-2 or eu-east-1. AWS region indicates the region in which your bucket(s) are stored.",
  example: "us-east-1",
  default: "us-east-1",
  model: awsRegions.map((region) => {
    return {
      label: region,
      value: region,
    };
  }),
});

export const name = input({
  label: "Name",
  type: "string",
  required: true,
  example: "MyExampleTopic",
  comments: "Provide a string for the name of the topic.",
});

export const topicArn = input({
  label: "Topic Arn",
  type: "string",
  required: true,
  example: "arn:aws:sns:us-east-2:123456789012:MyExampleTopic",
  comments:
    "An Amazon SNS topic is a logical access point that acts as a communication channel.",
});

export const message = input({
  label: "Message",
  type: "string",
  required: true,
  comments: "Provide a string for the message you would like to send.",
});

export const protocol = input({
  label: "protocol",
  type: "string",
  required: true,
  default: "https",
  model: [
    { label: "application", value: "application" },
    { label: "email", value: "email" },
    { label: "email-json", value: "email-json" },
    { label: "firehose", value: "firehose" },
    { label: "http", value: "http" },
    { label: "https", value: "https" },
    { label: "lambda", value: "lambda" },
    { label: "sms", value: "sms" },
    { label: "sqs", value: "sqs" },
  ],
  comments:
    "When you subscribe an endpoint to a topic, you must specify which protocol to use when this topic receives messages.",
});

export const endpoint = input({
  label: "Endpoint",
  type: "string",
  required: true,
  example: "example@company.com",
  comments:
    "The endpoint that you want to receive notifications. This could be an email address, URL, phone number, or SQS/application/Lambda/Firehose ARN.",
});

export const subscriptionArn = input({
  label: "Subscription Arn",
  type: "string",
  required: true,
  example:
    "arn:aws:sns:us-east-2:123456789012:MyExampleTopic:00000000-00000000-00000000-00000000",
  comments: "The unique identifier for a topic subscription",
});

export const phoneNumber = input({
  label: "Phone Number",
  type: "string",
  required: true,
  example: "12345678901",
  comments:
    "Provide a phone number that you would like to subscribe to your topic.",
});

export const messageAttributes = input({
  label: "Message Attributes",
  type: "string",
  required: false,
  collection: "keyvaluelist",
  example: "This is an example attribute",
  comments:
    "For each item, provide a key value pair representing a message attribute. When determining your message attributes, it is important that you follow the specifications listed in the Amazon SNS docs: https://docs.aws.amazon.com/sns/latest/api/API_MessageAttributeValue.html",
});

export const parseMessage = input({
  label: "Parse Message",
  type: "boolean",
  required: true,
  default: "false",
  comments:
    "When enabled the message from SNS will be parsed as JSON and returned. If disabled it will be passed as received.",
});

export const maxItems = input({
  label: "Max Items",
  type: "string",
  required: false,
  comments:
    "Provide an integer value for the maximum amount of items that will be returned. Provide a value from 1 to 50.",
  example: `20`,
});

export const nextToken = input({
  label: "Next Token",
  type: "string",
  required: false,
  comments:
    "Specify the pagination token that's returned by a previous request to retrieve the next page of results",
  example: `lslTXFcbLQKkb0vP9Kgh5hy0Y0OnC7Z9ZPHPwPmMnxSk3eiDRMkct7D8E`,
});

export const connectionInput = input({
  label: "Connection",
  type: "connection",
  required: true,
});
