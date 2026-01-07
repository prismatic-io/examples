import type { ObjectCannedACL, ObjectLockRetentionMode } from "@aws-sdk/client-s3";
import { util, input } from "@prismatic-io/spectral";
import {
  EVENT_BRIDGE_CONFIGURATION_EXAMPLE,
  INPUT_EVENT_TYPES_MODEL,
  LAMBDA_FUNCTION_CONFIGURATIONS_EXAMPLE,
  OBJECT_ATTRIBUTES,
  QUEUE_CONFIGURATIONS_EXAMPLE,
  TOPIC_CONFIGURATIONS_EXAMPLE,
} from "./constants";
import {
  getEventBridgeConfiguration,
  getLambdaFunctionConfigurations,
  getObjectAttributes,
  getObjectIdentifiers,
  getQueueConfigurations,
  getTopicConfigurations,
} from "./utils";

export const objectKeys = input({
  label: "Object Keys",
  placeholder: "path/to/file1.txt",
  type: "string",
  collection: "valuelist",
  required: true,
  comments:
    "A list of object keys to delete. These are the file paths of the objects you want to delete. Do not include a leading /.",
  example: "path/to/file1.txt",
  clean: getObjectIdentifiers,
});

export const objectKey = input({
  label: "Object Key",
  placeholder: "path/to/file.txt",
  type: "string",
  required: true,
  comments:
    "An object in S3 is a file that is saved in a 'bucket'. This represents the object's key (file path). Do not include a leading /.",
  example: "path/to/file.txt",
  clean: util.types.toString,
});

export const sourceKey = input({
  label: "Source Key",
  placeholder: "Enter source object key",
  type: "string",
  required: true,
  comments: "The source object's key (file path) to copy from. Do not include a leading /.",
  example: "backups/2024/database-backup.sql",
  clean: util.types.toString,
});

export const destinationKey = input({
  label: "Destination Key",
  placeholder: "Enter destination object key",
  type: "string",
  required: true,
  comments: "The destination object's key (file path) to copy to. Do not include a leading /.",
  example: "archive/2024/database-backup.sql",
  clean: util.types.toString,
});

export const fileContents = input({
  label: "File Contents",
  placeholder: "Output data from previous step or string content",
  type: "data",
  required: true,
  comments:
    "The contents to write to the object. Accepts text strings or binary data (images, PDFs, etc.) from previous steps.",
  example: "My File Contents",
  clean: util.types.toData,
});

export const bucket = input({
  label: "Bucket Name",
  placeholder: "my-s3-bucket-abc123",
  type: "string",
  required: true,
  comments:
    "An Amazon S3 'bucket' is a container where files are stored. You can create a bucket from within the AWS console. Bucket names contain only letters, numbers, and dashes.",
  example: "my-s3-bucket-abc123",
  dataSource: "selectBucket",
  clean: util.types.toString,
});

export const sourceBucket = input({
  label: "Source Bucket Name",
  placeholder: "Enter source bucket name",
  type: "string",
  required: true,
  comments:
    "The source bucket containing the object to copy. For same-bucket copies, use the same name for both source and destination buckets.",
  example: "my-company-data-prod",
  clean: util.types.toString,
});

export const destinationBucket = input({
  label: "Destination Bucket Name",
  placeholder: "Enter destination bucket name",
  type: "string",
  required: true,
  comments:
    "The destination bucket where the object will be copied. For same-bucket copies, use the same name for both source and destination buckets.",
  example: "my-company-archive",
  clean: util.types.toString,
});

export const prefix = input({
  label: "Prefix",
  placeholder: "path/to/files/",
  type: "string",
  required: false,
  default: "",
  comments:
    "List only objects prefixed with this string. For example, if you only want files in a directory called 'unprocessed', you can enter 'unprocessed/'. If this is left blank, all files in the selected bucket will be listed.",
  example: "path/to/files/",
  clean: util.types.toString,
});

export const tagging = input({
  label: "Object Tags",
  placeholder: "Enter tag value",
  type: "string",
  collection: "keyvaluelist",
  required: false,
  comments:
    "Key-value pairs to tag the object for filtering and organization. For more information, see [S3 Object Tagging](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-tagging.html).",
  example: "Environment, Production",
});

export const maxKeys = input({
  label: "Max Keys",
  type: "string",
  required: false,
  comments: "Maximum number of objects to return (1-1000). Defaults to 1000 if not specified.",
  example: "1000",
  placeholder: "Enter max keys (1-1000)",
  clean: util.types.toInt,
});

export const continuationToken = input({
  label: "Continuation Token",
  type: "string",
  required: false,
  comments: "Pagination token returned by a previous request to retrieve the next page of results.",
  example: "lslTXFcbLQKkb0vP9Kgh5hy0Y0OnC7Z9ZPHPwPmMnxSk3eiDRMkct7D8E",
  placeholder: "Enter continuation token",
  clean: util.types.toString,
});

export const accessKeyInput = input({
  label: "Connection",
  type: "connection",
  required: false,
  comments:
    "The AWS S3 connection to use for authentication. Access keys provide programmatic access to AWS resources. [Learn more](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html).",
});

export const acl = input({
  label: "ACL Permissions",
  comments:
    "Canned ACL permissions to apply to the object. For more information, see [S3 Canned ACLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#canned-acl).",
  type: "string",
  model: [
    { label: "BUCKET DEFAULT", value: "" },
    { label: "authenticated-read", value: "authenticated-read" },
    { label: "aws-exec-read", value: "aws-exec-read" },
    {
      label: "bucket-owner-full-control",
      value: "bucket-owner-full-control",
    },
    { label: "bucket-owner-read", value: "bucket-owner-read" },
    { label: "private", value: "private" },
    { label: "public-read", value: "public-read" },
    { label: "public-read-write", value: "public-read-write" },
  ],
  default: "",
  clean: (val) => util.types.toString(val) as ObjectCannedACL,
});

export const name = input({
  label: "Name",
  type: "string",
  required: true,
  example: "ProductionNotifications",
  placeholder: "Enter topic name",
  comments: "The name of the SNS topic to create.",
  clean: util.types.toString,
});

export const snsTopicArn = input({
  label: "SNS Topic ARN",
  type: "string",
  required: true,
  example: "arn:aws:sns:us-east-1:123456789012:S3EventNotifications",
  placeholder: "Enter SNS topic ARN",
  comments:
    "The Amazon Resource Name (ARN) of the SNS topic. For more information, see [SNS ARN Format](https://docs.aws.amazon.com/sns/latest/dg/sns-getting-started.html).",
  clean: util.types.toString,
});

export const bucketOwnerAccountid = input({
  label: "Bucket Owner Account ID",
  type: "string",
  required: true,
  example: "123456789012",
  placeholder: "Enter 12-digit AWS account ID",
  comments:
    "The 12-digit AWS Account ID of the bucket owner. Find this in the AWS Console account settings or use the 'Get Current Account' action.",
  clean: util.types.toString,
});

export const endpoint = input({
  label: "Webhook Endpoint",
  type: "string",
  required: true,
  example:
    "https://hooks.example.com/trigger/SW5zdGFuY2VGbG93Q29uZmlnOjhiNGY0ZTRkLWIyODMtNDE4Yy04YmZhLTg1NGI11234567890==",
  placeholder: "Enter webhook URL",
  comments: "The HTTPS endpoint URL that will receive S3 event notifications.",
  clean: util.types.toString,
});

export const subscriptionArn = input({
  label: "Subscription ARN",
  type: "string",
  required: true,
  example: "arn:aws:sns:us-east-2:123456789012:MyTopic:a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890",
  placeholder: "Enter subscription ARN",
  comments: "The Amazon Resource Name (ARN) of the SNS topic subscription.",
  clean: util.types.toString,
});

export const eventsList = input({
  label: "Event Types",
  comments:
    "S3 event types that will trigger notifications. For more information, see [S3 Event Notification Types](https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-event-types-and-destinations.html).",
  type: "string",
  collection: "valuelist",
  model: INPUT_EVENT_TYPES_MODEL,
  example: "s3:ObjectCreated:*",
  placeholder: "Select event types",
  required: true,
  clean: (stringArray: unknown) =>
    (stringArray as []).map((string: string) => util.types.toString(string).trim()),
});

export const eventNotificationName = input({
  label: "Event Notification Name",
  type: "string",
  required: true,
  example: "S3ObjectCreatedAlert",
  placeholder: "Enter event notification name",
  comments: "A unique name for the event notification configuration.",
  clean: util.types.toString,
});

export const expirationSeconds = input({
  label: "Expiration Seconds",
  type: "string",
  required: true,
  default: "3600",
  placeholder: "Enter seconds (e.g., 3600 for 1 hour)",
  comments: "Number of seconds until the presigned URL expires. Default is 3600 (1 hour).",
  clean: util.types.toInt,
});

export const actionType = input({
  label: "Action Type",
  type: "string",
  comments: "Specifies whether the presigned URL will allow download or upload operations.",
  clean: util.types.toString,
  required: true,
  default: "download",
  placeholder: "Select action type",
  model: [
    { label: "Download", value: "download" },
    { label: "Upload", value: "upload" },
  ],
});

export const urlsToGenerate = input({
  label: "URLs to Generate",
  type: "string",
  required: true,
  default: "5",
  placeholder: "Enter number of URLs",
  example: "10",
  comments: "The number of presigned URLs to generate for multipart uploads.",
  clean: (value: unknown) => util.types.toInt(value, 5),
});

export const uploadId = input({
  label: "Upload ID",
  type: "string",
  required: true,
  comments:
    "The unique identifier for the multipart upload, returned by 'Create Multipart Upload' action.",
  clean: util.types.toString,
  example: "xadcOB_7YPBOJuoFiQ9cz4P3Pe6FIZwO4f7wN93uHsNBEw97pl5eNwzExg0LAT2dUN91cOmrEQHDsP3WA60CEg",
  placeholder: "Enter multipart upload ID",
});

export const fileChunk = input({
  label: "File Chunk",
  type: "data",
  required: true,
  comments:
    "The binary data chunk to upload as part of a multipart upload. Reference output from a previous step.",
  placeholder: "Select file chunk data",
  clean: (value: unknown): Buffer =>
    util.types.isBufferDataPayload(value) ? value.data : (value as Buffer),
});

export const partNumber = input({
  label: "Part Number",
  type: "string",
  required: true,
  comments: "The part number for this chunk in the multipart upload sequence (1-10,000).",
  placeholder: "Enter part number (1-10,000)",
  example: "1",
  clean: util.types.toInt,
});

export const topicConfigurations = input({
  label: "Topic Configurations",
  type: "code",
  language: "json",
  required: false,
  default: JSON.stringify(TOPIC_CONFIGURATIONS_EXAMPLE, null, 2),
  example: JSON.stringify(TOPIC_CONFIGURATIONS_EXAMPLE, null, 2),
  comments:
    "List of SNS topic configurations for bucket event notifications. For more information, see [S3 Event Notifications](https://docs.aws.amazon.com/AmazonS3/latest/userguide/NotificationHowTo.html).",
  clean: getTopicConfigurations,
});

export const queueConfigurations = input({
  label: "Queue Configurations",
  type: "code",
  language: "json",
  required: false,
  default: JSON.stringify(QUEUE_CONFIGURATIONS_EXAMPLE, null, 2),
  example: JSON.stringify(QUEUE_CONFIGURATIONS_EXAMPLE, null, 2),
  comments:
    "List of SQS queue configurations for bucket event notifications. For more information, see [S3 Event Notifications](https://docs.aws.amazon.com/AmazonS3/latest/userguide/NotificationHowTo.html).",
  clean: getQueueConfigurations,
});

export const lambdaFunctionConfigurations = input({
  label: "Lambda Function Configurations",
  type: "code",
  language: "json",
  required: false,
  default: JSON.stringify(LAMBDA_FUNCTION_CONFIGURATIONS_EXAMPLE, null, 2),
  example: JSON.stringify(LAMBDA_FUNCTION_CONFIGURATIONS_EXAMPLE, null, 2),
  comments:
    "List of Lambda function configurations for bucket event notifications. For more information, see [S3 Event Notifications](https://docs.aws.amazon.com/AmazonS3/latest/userguide/NotificationHowTo.html).",
  clean: getLambdaFunctionConfigurations,
});

export const eventBridgeConfiguration = input({
  label: "EventBridge Configuration",
  type: "code",
  language: "json",
  required: false,
  default: JSON.stringify(EVENT_BRIDGE_CONFIGURATION_EXAMPLE, null, 2),
  example: JSON.stringify(EVENT_BRIDGE_CONFIGURATION_EXAMPLE, null, 2),
  comments:
    "EventBridge configuration for bucket event notifications. For more information, see [Using EventBridge with S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventBridge.html).",
  clean: getEventBridgeConfiguration,
});

export const defaultRetentionDays = input({
  label: "Default Retention Days",
  type: "string",
  required: false,
  placeholder: "Enter retention days",
  example: "90",
  comments:
    "Number of days for the default retention period. Mutually exclusive with Default Retention Years.",
  clean: util.types.toInt,
});

export const defaultRetentionYears = input({
  label: "Default Retention Years",
  type: "string",
  required: false,
  placeholder: "Enter retention years",
  example: "7",
  comments:
    "Number of years for the default retention period. Mutually exclusive with Default Retention Days.",
  clean: util.types.toInt,
});

export const defaultRetentionMode = input({
  label: "Default Retention Mode",
  type: "string",
  required: false,
  comments:
    "Object Lock retention mode for new objects. Must be used with either Default Retention Days or Years. For more information, see [S3 Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html).",
  placeholder: "Select retention mode",
  model: [
    { label: "Unset", value: "" },
    { label: "Governance", value: "GOVERNANCE" },
    { label: "Compliance", value: "COMPLIANCE" },
  ],
  clean: (value) => util.types.toString(value) as ObjectLockRetentionMode,
});

export const versionId = input({
  label: "Version ID",
  type: "string",
  required: false,
  placeholder: "Enter version ID",
  example: "AMn71WZYnWqbvfy0unBOdtaBC.DRiN_r",
  comments:
    "The version ID of the object to apply retention configuration to. Required when versioning is enabled.",
  clean: util.types.toString,
});

export const retainUntilDate = input({
  label: "Retain Until Date",
  type: "string",
  placeholder: "Enter date (YYYY-MM-DDTHH:MM:SSZ)",
  example: "2025-12-31T23:59:59.000Z",
  required: false,
  comments:
    "The date and time when Object Retention expires. Required when using Retention Mode. Must be in ISO 8601 format.",
  clean: util.types.toString,
});

export const objectAttributes = input({
  label: "Object Attributes",
  type: "string",
  collection: "valuelist",
  required: true,
  model: OBJECT_ATTRIBUTES.map((attribute) => ({
    label: attribute,
    value: attribute,
  })),
  comments:
    "The object attributes to return in the response. Unspecified attributes are not returned.",
  placeholder: "Select object attributes",
  clean: getObjectAttributes,
});

export const includeMetadata = input({
  label: "Include Metadata",
  type: "boolean",
  required: true,
  default: "false",
  comments:
    "When true, returns full object metadata and pagination information instead of just object keys.",
  clean: util.types.toBool,
});

export const parts = input({
  label: "Parts",
  type: "data",
  comments:
    "The list of uploaded parts to complete the multipart upload. Reference the 'Parts' field from the 'List Parts' action output.",
  placeholder: "Select parts data from List Parts action",
  required: true,
});
