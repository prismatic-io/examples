import { input, util } from "@prismatic-io/spectral";
import { batchMessageEntriesExample } from "./constants/batchMessageEntriesExample";
import { cleanStringInput } from "./utils";

export const name = input({
  label: "Name",
  type: "string",
  required: true,
  placeholder: "Enter topic name",
  example: "MyExampleTopic",
  comments: "The name of the SNS topic to create.",
});

export const topicArn = input({
  label: "Topic ARN",
  type: "string",
  required: true,
  placeholder: "Enter topic ARN",
  example: "arn:aws:sns:us-east-1:123456789012:MyExampleTopic",
  comments:
    "The Amazon Resource Name (ARN) of the SNS topic. [Learn more](https://docs.aws.amazon.com/sns/latest/api/API_CreateTopic.html)",
  dataSource: "selectTopic",
  clean: util.types.toString,
});

export const message = input({
  label: "Message",
  type: "string",
  required: true,
  placeholder: "Enter message content",
  example: "Your order has been shipped!",
  comments:
    "The message content to send to the topic or endpoint. [Learn more](https://docs.aws.amazon.com/sns/latest/api/API_Publish.html)",
});

export const protocol = input({
  label: "Protocol",
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
    "The protocol to use for delivering messages to the endpoint (application, email, email-json, firehose, http, https, lambda, sms, or sqs). [Learn more](https://docs.aws.amazon.com/sns/latest/api/API_Subscribe.html)",
});

export const endpoint = input({
  label: "Endpoint",
  type: "string",
  required: true,
  placeholder: "Enter endpoint",
  example: "https://example.com/webhook",
  comments:
    "The endpoint to receive notifications. Format depends on protocol: email address (email@example.com), URL (https://example.com), phone number (+12065551234), or ARN (arn:aws:sqs:us-east-1:123456789012:MyQueue). [Learn more](https://docs.aws.amazon.com/sns/latest/api/API_Subscribe.html)",
});

export const subscriptionArn = input({
  label: "Subscription ARN",
  type: "string",
  required: true,
  placeholder: "Enter subscription ARN",
  example:
    "arn:aws:sns:us-east-1:123456789012:MyExampleTopic:12345678-1234-1234-1234-123456789012",
  comments:
    "The Amazon Resource Name (ARN) of the subscription. [Learn more](https://docs.aws.amazon.com/sns/latest/api/API_Unsubscribe.html)",
  clean: util.types.toString,
  dataSource: "selectSubscription",
});

export const phoneNumber = input({
  label: "Phone Number",
  type: "string",
  required: true,
  placeholder: "Enter phone number (+12065551234)",
  example: "+12065551234",
  comments:
    "The phone number in E.164 format (e.g., +12065551234) to receive SMS messages. [Learn more](https://docs.aws.amazon.com/sns/latest/dg/sms_publish-to-phone.html)",
});

export const messageAttributes = input({
  label: "Message Attributes",
  type: "string",
  required: false,
  collection: "keyvaluelist",
  placeholder: "Enter key-value pairs",
  example: '{"name": "John Doe", "age": "30"}',
  comments:
    "Optional message attributes as key-value pairs. The value will be automatically typed (String, Number, String.Array, or Binary for Buffer). For binary data, provide a Buffer from a previous step. [Learn more](https://docs.aws.amazon.com/sns/latest/api/API_MessageAttributeValue.html)",
});

export const parseMessage = input({
  label: "Parse Message",
  type: "boolean",
  required: true,
  default: "false",
  comments:
    "When enabled, the message from SNS will be parsed as JSON and returned. When disabled, it will be passed as received.",
});

export const maxItems = input({
  label: "Max Items",
  type: "string",
  required: false,
  placeholder: "Enter maximum items (1-50)",
  example: "20",
  comments:
    "The maximum number of items to return per request. Valid values: 1-50.",
});

export const nextToken = input({
  label: "Next Token",
  type: "string",
  required: false,
  placeholder: "Enter pagination token",
  example: "lslTXFcbLQKkb0vP9Kgh5hy0Y0OnC7Z9ZPHPwPmMnxSk3eiDRMkct7D8E",
  comments:
    "The pagination token returned by a previous request to retrieve the next page of results.",
  clean: cleanStringInput,
});

export const connectionInput = input({
  label: "Connection",
  type: "connection",
  required: true,
  comments: "The Amazon SNS connection to use.",
});

export const publishBatchEntries = input({
  label: "Message Entries",
  type: "code",
  language: "json",
  required: true,
  default: JSON.stringify(batchMessageEntriesExample, null, 2),
  comments:
    "An array of message entries to publish in batch. Each entry must include an Id and Message. For binary messages, add a Template Field containing a Buffer to the BinaryValue attribute. [Learn more](https://docs.aws.amazon.com/sns/latest/dg/sns-message-attributes.html)",
});

const fetchAll = input({
  label: "Fetch All",
  type: "boolean",
  required: true,
  default: "false",
  clean: util.types.toBool,
});

export const fetchAllTopics = {
  ...fetchAll,
  comments:
    "When set to true, fetches all paginated topics. When false, only 100 topics will be returned.",
};

export const fetchAllSubscriptions = {
  ...fetchAll,
  comments:
    "When set to true, fetches all paginated subscriptions. When false, only 100 subscriptions will be returned.",
};
