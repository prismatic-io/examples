import { input } from "@prismatic-io/spectral";

export const keyInputField = input({
  key: "objectKey",
  label: "Object Key",
  placeholder: "Object Key",
  type: "string",
  required: true,
  comments: "The S3 Object Key",
  example: "path/to/file.txt",
});

export const sourceKeyInputField = input({
  key: "sourceKey",
  label: "Source Key",
  placeholder: "Source Key",
  type: "string",
  required: true,
  comments: "The key of the source object",
  example: "path/to/source/file.txt",
});

export const destinationKeyInputField = input({
  key: "destinationKey",
  label: "Destination Key",
  placeholder: "Destination Key",
  type: "string",
  required: true,
  comments: "The key of the destination object",
  example: "path/to/destination/file.txt",
});

export const fileContentsInputField = input({
  key: "fileContents",
  label: "File Contents",
  placeholder: "Output data from previous step, or a string, to write",
  type: "data",
  required: true,
  comments: "A string literal or binary data from a previous step",
  example: "My File Contents",
});

export const bucketInputField = input({
  key: "bucket",
  label: "Bucket Name",
  placeholder: "Name of an S3 Bucket",
  type: "string",
  required: true,
  comments: "Name of an S3 Bucket",
  example: "my-s3-bucket-abc123",
});

export const sourceBucketInputField = input({
  key: "sourceBucket",
  label: "Source Bucket Name",
  placeholder: "Source Bucket Name",
  type: "string",
  required: true,
  comments: "Bucket to move files from",
  example: "my-source-bucket",
});

export const destinationBucketInputField = input({
  key: "destinationBucket",
  label: "Destination Bucket Name",
  placeholder: "Destination Bucket Name",
  type: "string",
  required: true,
  comments: "Bucket to move files to",
  example: "my-destination-bucket",
});

export const awsRegionInputField = input({
  // FIXME: Add a `model` and make this a dropdown
  key: "awsRegion",
  label: "AWS Region",
  placeholder: "AWS Region",
  type: "string",
  required: true,
  comments: "AWS Region",
  example: "us-east-1",
});

export const prefixInputField = input({
  key: "prefix",
  label: "Prefix",
  placeholder: "Prefix",
  type: "string",
  required: false,
  default: "",
  comments: "List only objects prefixed with this string",
  example: "path/to/files/",
});

export const taggingInputField = input({
  key: "tagging",
  label: "Object Tags",
  placeholder: "Object Tags (e.g. 'key1=value1[&key2=value2]')",
  type: "string",
  required: false,
  default: "",
  comments: "Object Tags",
  example: "key1=value1[&key2=value2]",
});
