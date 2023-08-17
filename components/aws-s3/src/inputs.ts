import { input, util } from "@prismatic-io/spectral";
import awsRegions from "./aws-regions.json";

export const objectKey = input({
  label: "Object Key",
  placeholder: "Object Key",
  type: "string",
  required: true,
  comments:
    "An object in S3 is a file that is saved in a 'bucket'. This represents the object's key (file path). Do not include a leading /.",
  example: "path/to/file.txt",
  clean: util.types.toString,
});

export const sourceKey = input({
  label: "Source Key",
  placeholder: "Source Key",
  type: "string",
  required: true,
  comments:
    "An object in S3 is a file that is saved in a 'bucket'. This represents the source object's key (file path). Do not include a leading /.",
  example: "path/to/source/file.txt",
  clean: util.types.toString,
});

export const destinationKey = input({
  label: "Destination Key",
  placeholder: "Destination Key",
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
  placeholder: "Name of an S3 Bucket",
  type: "string",
  required: true,
  comments:
    "An Amazon S3 'bucket' is a container where files are stored. You can create a bucket from within the AWS console. Bucket names contain only letters, numbers, and dashes.",
  example: "my-s3-bucket-abc123",
  clean: util.types.toString,
});

export const sourceBucket = input({
  label: "Source Bucket Name",
  placeholder: "Source Bucket Name",
  type: "string",
  required: true,
  comments:
    "An Amazon S3 'bucket' is a container where files are stored. The source bucket indicates the bucket containing the file you want to copy. If you are copying files within a single bucket, list the same bucket as the source and destination bucket.",
  example: "my-source-bucket",
  clean: util.types.toString,
});

export const destinationBucket = input({
  label: "Destination Bucket Name",
  placeholder: "Destination Bucket Name",
  type: "string",
  required: true,
  comments:
    "An Amazon S3 'bucket' is a container where files are stored. The destination bucket indicates the bucket where you want a file to be stored. If you are copying files within a single bucket, list the same bucket as the source and destination bucket.",
  example: "my-destination-bucket",
  clean: util.types.toString,
});

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
  clean: util.types.toString,
});

export const prefix = input({
  label: "Prefix",
  placeholder: "Prefix",
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
  placeholder: "Object Tags",
  type: "string",
  collection: "keyvaluelist",
  required: false,
  comments:
    "Objects in an S3 bucket can be optionally tagged so you can filter for files more easily. For example, you may want to tag customers with a key of 'Customer Name' and value of 'Mars Missions Corp'",
});

export const maxKeys = input({
  label: "Max Keys",
  type: "string",
  required: false,
  comments:
    "Provide an integer value for the maximum amount of items that will be returned. Provide a value from 1 to 1000.",
  example: `1000`,
  clean: util.types.toInt,
});

export const continuationToken = input({
  label: "ContinuationToken",
  type: "string",
  required: false,
  comments:
    "Specify the pagination token that's returned by a previous request to retrieve the next page of results",
  example: `lslTXFcbLQKkb0vP9Kgh5hy0Y0OnC7Z9ZPHPwPmMnxSk3eiDRMkct7D8E`,
  clean: util.types.toString,
});

export const accessKeyInput = input({
  label: "Connection",
  type: "connection",
  placeholder: "AWS IAM Access Key",
  required: true,
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
  clean: util.types.toString,
});

export const name = input({
  label: "Name",
  type: "string",
  required: true,
  example: "MyExampleTopic",
  comments: "Provide a string for the name of the topic.",
  clean: util.types.toString,
});

export const snsTopicArn = input({
  label: "SNS Topic ARN",
  type: "string",
  required: true,
  example: "arn:aws:sns:us-east-1:123456789012:MyExampleTopic",
  clean: util.types.toString,
});

export const bucketOwnerAccountid = input({
  label: "Bucket Owner Account ID",
  type: "string",
  required: true,
  example: "123456789012",
  comments:
    "Provide the AWS Account ID of the bucket owner. It can be found in the account settings of the AWS console.",
  clean: util.types.toString,
});

export const endpoint = input({
  label: "Webhook Endpoint",
  type: "string",
  required: true,
  example:
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
  comments: "The unique identifier for a topic subscription",
  clean: util.types.toString,
});

export const eventsList = input({
  label: "Event",
  comments: "S3 Bucket change event type to trigger the webhook",
  type: "string",
  collection: "valuelist",
  example: "s3:ObjectCreated:*",
  required: true,
  clean: (stringArray: any) =>
    stringArray.map((string: string) => util.types.toString(string).trim()),
});

export const eventNotificationName = input({
  label: "Event Notification Name",
  type: "string",
  required: true,
  example: "MyExampleEventNotification",
  comments: "Provide a string for the name of the event notification.",
  clean: util.types.toString,
});
