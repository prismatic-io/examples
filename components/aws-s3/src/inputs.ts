import { input } from "@prismatic-io/spectral";

export const keyInputField = input({
  key: "objectKey",
  label: "Object Key",
  placeholder: "Object Key",
  type: "string",
  required: true,
  comments: "The S3 Object Key (e.g. path/to/file.txt)",
});

export const sourceKeyInputField = input({
  key: "sourceKey",
  label: "Source Key",
  placeholder: "Source Key",
  type: "string",
  required: true,
  comments: "The key of the source object",
});

export const destinationKeyInputField = input({
  key: "destinationKey",
  label: "Destination Key",
  placeholder: "Destination Key",
  type: "string",
  required: true,
  comments: "The key of the destination object",
});

export const fileContentsInputField = input({
  key: "fileContents",
  label: "File Contents",
  placeholder: "Output data from previous step, or a string, to write",
  type: "data",
  required: true,
  comments: "Binary file data or a string",
});

export const bucketInputField = input({
  key: "bucket",
  label: "Bucket Name",
  placeholder: "Name of an S3 Bucket",
  type: "string",
  required: true,
  comments: "Name of an S3 Bucket",
});

export const sourceBucketInputField = input({
  key: "sourceBucket",
  label: "Source Bucket Name",
  placeholder: "Source Bucket Name",
  type: "string",
  required: true,
  comments: "Bucket to move files from",
});

export const destinationBucketInputField = input({
  key: "destinationBucket",
  label: "Destination Bucket Name",
  placeholder: "Destination Bucket Name",
  type: "string",
  required: true,
  comments: "Bucket to move files to",
});

export const awsRegionInputField = input({
  // FIXME: Add a `model` and make this a dropdown
  key: "awsRegion",
  label: "AWS Region",
  placeholder: "AWS Region",
  type: "string",
  required: true,
  comments: "AWS Region (e.g. 'us-west-2')",
});

export const prefixInputField = input({
  key: "prefix",
  label: "Prefix",
  placeholder: "Prefix",
  type: "string",
  required: false,
  default: "",
  comments:
    "List only objects prefixed with this string, (e.g. 'path/to/files/')",
});

export const taggingInputField = input({
  key: "tagging",
  label: "Object Tags",
  placeholder: "Object Tags (e.g. 'key1=value1[&key2=value2]')",
  type: "string",
  required: false,
  default: "",
  comments: "Object Tags (e.g. 'key1=value1[&key2=value2]')",
});
