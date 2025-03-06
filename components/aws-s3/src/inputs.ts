import { input, util } from "@prismatic-io/spectral";
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
import { ObjectCannedACL, ObjectLockRetentionMode } from "@aws-sdk/client-s3";

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
  placeholder: "path/to/source/file.txt",
  type: "string",
  required: true,
  comments:
    "An object in S3 is a file that is saved in a 'bucket'. This represents the source object's key (file path). Do not include a leading /.",
  example: "path/to/source/file.txt",
  clean: util.types.toString,
});

export const destinationKey = input({
  label: "Destination Key",
  placeholder: "path/to/destination/file.txt",
  type: "string",
  required: true,
  comments:
    "An object in S3 is a file that is saved in a 'bucket'. This represents the destination object's key (file path). Do not include a leading /.",
  example: "path/to/destination/file.txt",
  clean: util.types.toString,
});

export const fileContents = input({
  label: "File Contents",
  placeholder: "Output data from previous step, or a string, to write",
  type: "data",
  required: true,
  comments:
    "The contents to write to a file. This can be a string of text, it can be binary data (like an image or PDF) that was generated in a previous step.",
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
  clean: util.types.toString,
});

export const sourceBucket = input({
  label: "Source Bucket Name",
  placeholder: "my-source-bucket",
  type: "string",
  required: true,
  comments:
    "An Amazon S3 'bucket' is a container where files are stored. The source bucket indicates the bucket containing the file you want to copy. If you are copying files within a single bucket, list the same bucket as the source and destination bucket.",
  example: "my-source-bucket",
  clean: util.types.toString,
});

export const destinationBucket = input({
  label: "Destination Bucket Name",
  placeholder: "my-destination-bucket",
  type: "string",
  required: true,
  comments:
    "An Amazon S3 'bucket' is a container where files are stored. The destination bucket indicates the bucket where you want a file to be stored. If you are copying files within a single bucket, list the same bucket as the source and destination bucket.",
  example: "my-destination-bucket",
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
  placeholder: "Mars Missions Corp",
  type: "string",
  collection: "keyvaluelist",
  required: false,
  comments:
    "Objects in an S3 bucket can be optionally tagged so you can filter for files more easily. For example, you may want to tag customers with a key of 'Customer Name' and value of 'Mars Missions Corp'",
  example: "key: Customer Name, value: Mars Missions Corp",
});

export const maxKeys = input({
  label: "Max Keys",
  type: "string",
  required: false,
  comments:
    "Provide an integer value for the maximum amount of items that will be returned. Provide a value from 1 to 1000.",
  example: `1000`,
  placeholder: "500",
  clean: util.types.toInt,
});

export const continuationToken = input({
  label: "Continuation Token",
  type: "string",
  required: false,
  comments:
    "Specify the pagination token that's returned by a previous request to retrieve the next page of results",
  example: `lslTXFcbLQKkb0vP9Kgh5hy0Y0OnC7Z9ZPHPwPmMnxSk3eiDRMkct7D8E`,
  placeholder: `lslTXFcbLQKkb0vP9Kgh5hy0Y0OnC7Z9ZPHPwPmMnxSk3eiDRMkct7D8E`,
  clean: util.types.toString,
});

export const accessKeyInput = input({
  label: "Connection",
  type: "connection",
  placeholder: "AWS IAM Access Key",
  required: false,
  comments:
    "Access keys provide programmatic access to access resources in AWS. See https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html.",
});

export const acl = input({
  label: "ACL Permissions",
  comments:
    "A set of canned ACL permissions to apply to the object. See https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#canned-acl",
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
  example: "MyExampleTopic",
  placeholder: "MyExampleTopic",
  comments: "Provide a string for the name of the topic.",
  clean: util.types.toString,
});

export const snsTopicArn = input({
  label: "SNS Topic ARN",
  type: "string",
  required: true,
  example: "arn:aws:sns:us-east-1:123456789012:MyExampleTopic",
  placeholder: "arn:aws:sns:us-east-1:123456789012:MyExampleTopic",
  comments: "The Amazon Resource Name (ARN) of the topic.",
  clean: util.types.toString,
});

export const bucketOwnerAccountid = input({
  label: "Bucket Owner Account ID",
  type: "string",
  required: true,
  example: "012345678901",
  placeholder: "012345678901",
  comments:
    "Provide the AWS Account ID of the bucket owner. It can be found in the account settings of the AWS console, or can be retrieved using the 'Get Current Account' action.",
  clean: util.types.toString,
});

export const endpoint = input({
  label: "Webhook Endpoint",
  type: "string",
  required: true,
  example:
    "https://hooks.prismatic.io/trigger/SW5zdGFuY2VGbG93Q29uZmlnOjhiNGY0ZTRkLWIyODMtNDE4Yy04YmZhLTg1NGI11234567890==",
  placeholder:
    "https://hooks.prismatic.io/trigger/SW5zdGFuY2VGbG93Q29uZmlnOjhiNGY0ZTRkLWIyODMtNDE4Yy04YmZhLTg1NGI11234567890==",
  comments: "The endpoint that you want to trigger when an S3 event occurs.",
  clean: util.types.toString,
});

export const subscriptionArn = input({
  label: "Subscription Arn",
  type: "string",
  required: true,
  example:
    "arn:aws:sns:us-east-2:123456789012:MyExampleTopic:00000000-00000000-00000000-00000000",
  placeholder:
    "arn:aws:sns:us-east-2:123456789012:MyExampleTopic:00000000-00000000-00000000-00000000",
  comments: "The unique identifier for a topic subscription",
  clean: util.types.toString,
});

export const eventsList = input({
  label: "Event",
  comments: "S3 Bucket change event type to trigger the webhook",
  type: "string",
  collection: "valuelist",
  model: INPUT_EVENT_TYPES_MODEL,
  example: "s3:ObjectCreated:*",
  placeholder: "s3:ObjectCreated:*",
  required: true,
  clean: (stringArray: unknown) =>
    (stringArray as []).map((string: string) =>
      util.types.toString(string).trim(),
    ),
});

export const eventNotificationName = input({
  label: "Event Notification Name",
  type: "string",
  required: true,
  example: "MyExampleEventNotification",
  placeholder: "MyExampleEventNotification",
  comments: "Provide a string for the name of the event notification.",
  clean: util.types.toString,
});

export const expirationSeconds = input({
  label: "Expiration Seconds",
  type: "string",
  required: true,
  default: "3600",
  placeholder: "3600",
  comments: "This presigned URL will expire in this many seconds",
  clean: util.types.toInt,
});

export const actionType = input({
  label: "Action (Download or Upload)",
  type: "string",
  comments: "Should this URL allow a user to upload or download an object?",
  clean: util.types.toString,
  required: true,
  default: "download",
  model: [
    { label: "Download", value: "download" },
    { label: "Upload", value: "upload" },
  ],
});

export const urlsToGenerate = input({
  label: "Urls to Generate",
  type: "string",
  required: true,
  default: "5",
  placeholder: "5",
  example: "5",
  comments: "The amount of urls to generate",
  clean: (value: unknown) => util.types.toInt(value, 5),
});

export const uploadId = input({
  label: "Upload ID",
  type: "string",
  required: true,
  comments: "Multipart upload ID",
  clean: util.types.toString,
  example:
    "xadcOB_7YPBOJuoFiQ9cz4P3Pe6FIZwO4f7wN93uHsNBEw97pl5eNwzExg0LAT2dUN91cOmrEQHDsP3WA60CEg",
  placeholder:
    "xadcOB_7YPBOJuoFiQ9cz4P3Pe6FIZwO4f7wN93uHsNBEw97pl5eNwzExg0LAT2dUN91cOmrEQHDsP3WA60CEg",
});

export const fileChunk = input({
  label: "File Chunk",
  type: "data",
  required: true,
  comments:
    "The file data chunk to upload. This can be binary data referenced from a previous step.",
  clean: (value: unknown): Buffer =>
    util.types.isBufferDataPayload(value) ? value.data : (value as Buffer),
});

export const partNumber = input({
  label: "Part Number",
  type: "string",
  required: true,
  comments:
    "Part number of part being uploaded. This is a positive integer between 1 and 10,000.",
  placeholder: "1",
  example: "1",
  clean: util.types.toInt,
});

export const topicConfigurations = input({
  label: "Topic Configurations",
  type: "code",
  language: "json",
  required: false,
  default: JSON.stringify(TOPIC_CONFIGURATIONS_EXAMPLE, null, 2),
  example: JSON.stringify(TOPIC_CONFIGURATIONS_EXAMPLE),
  comments:
    "List of Topic configurations to be added to the bucket notification configuration.",
  clean: getTopicConfigurations,
});

export const queueConfigurations = input({
  label: "Queue Configurations",
  type: "code",
  language: "json",
  required: false,
  default: JSON.stringify(QUEUE_CONFIGURATIONS_EXAMPLE, null, 2),
  example: JSON.stringify(QUEUE_CONFIGURATIONS_EXAMPLE),
  comments:
    "List of Queue configurations to be added to the bucket notification configuration.",
  clean: getQueueConfigurations,
});

export const lambdaFunctionConfigurations = input({
  label: "Lambda Function Configurations",
  type: "code",
  language: "json",
  required: false,
  default: JSON.stringify(LAMBDA_FUNCTION_CONFIGURATIONS_EXAMPLE, null, 2),
  example: JSON.stringify(LAMBDA_FUNCTION_CONFIGURATIONS_EXAMPLE),
  comments:
    "List of Lambda Function configurations to be added to the bucket notification configuration.",
  clean: getLambdaFunctionConfigurations,
});

export const eventBridgeConfiguration = input({
  label: "EventBridge Configuration",
  type: "code",
  language: "json",
  required: false,
  default: JSON.stringify(EVENT_BRIDGE_CONFIGURATION_EXAMPLE, null, 2),
  example: JSON.stringify(EVENT_BRIDGE_CONFIGURATION_EXAMPLE),
  comments:
    "EventBridge configuration to be added to the bucket notification configuration.",
  clean: getEventBridgeConfiguration,
});

export const defaultRetentionDays = input({
  label: "Default Retention Days",
  type: "string",
  required: false,
  placeholder: "20",
  example: "20",
  comments:
    "The number of days that you want to specify for the default retention period. You can specify either Default Retention Days or Default Retention Years, but not both.",
  clean: util.types.toInt,
});

export const defaultRetentionYears = input({
  label: "Default Retention Years",
  type: "string",
  required: false,
  placeholder: "2",
  example: "2",
  comments:
    "The number of years that you want to specify for the default retention period. You can specify either Default Retention Days or Default Retention Years, but not both.",
  clean: util.types.toInt,
});

export const defaultRetentionMode = input({
  label: "Default Retention Mode",
  type: "string",
  required: false,
  comments:
    "The default Object Lock retention mode you want to apply to new objects placed in the specified bucket. Must be used with either Default Retention Days or Default Retention Years.",
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
  placeholder: "AMn71WZYnWqbvfy0unBOdtaBC.DRiN_r",
  example: "AMn71WZYnWqbvfy0unBOdtaBC.DRiN_r",
  comments:
    "The version ID for the object that you want to apply this Object Retention configuration to.",
  clean: util.types.toString,
});

export const retainUntilDate = input({
  label: "Retain Until Date",
  type: "string",
  placeholder: "YYYY-MM-DDTHH:MM:SSZ",
  example: "2024-08-25T20:00:00.000Z",
  required: false,
  comments:
    "The date and time when you want the specified Object Retention configuration to expire. Required when using Retention Mode.",
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
    "Specifies the fields at the root level that you want returned in the response. Fields that you do not specify are not returned.",
  clean: getObjectAttributes,
});

export const includeMetadata = input({
  label: "Include Metadata",
  type: "boolean",
  required: true,
  default: "false",
  comments:
    "By default, this action returns a list of object keys. When this is set to true, additional metadata about each object is returned, along with pagination information.",
  clean: util.types.toBool,
});

export const parts = input({
  label: "Parts",
  type: "data",
  comments:
    "Use the List Parts action to get the list of parts. Reference the 'Parts' field from the List Parts action output at the input for this field.",
  required: true,
});
