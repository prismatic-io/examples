import { input } from "@prismatic-io/spectral";

export const projectInputField = input({
  key: "project",
  label: "GCP Project ID",
  placeholder: "GCP Project ID",
  type: "string",
  required: true,
  comments: "Google Cloud Project ID",
  example: "my-sample-project-123",
});

export const bucketNameInputField = input({
  key: "bucketName",
  label: "Bucket Name",
  placeholder: "Bucket Name",
  type: "string",
  required: true,
  comments: "Name of a GCS bucket",
  example: "my-gcs-bucket",
});

export const sourceBucketNameInputField = input({
  key: "sourceBucketName",
  label: "Source Bucket",
  placeholder: "Source Bucket Name",
  type: "string",
  required: true,
  comments: "Bucket to move files from",
  example: "my-source-bucket",
});

export const destinationBucketNameInputField = input({
  key: "destinationBucketName",
  label: "Destination Bucket",
  placeholder: "Destination Bucket Name",
  type: "string",
  required: true,
  comments: "Bucket to move files to",
  example: "my-destination-bucket",
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

export const fileNameInputField = input({
  key: "fileName",
  label: "File Name",
  placeholder: "Full file name",
  type: "string",
  required: true,
  comments: "The full object key",
  example: "path/to/file.txt",
});

export const sourceFileNameInputField = input({
  key: "sourceFileName",
  label: "Source File Name",
  placeholder: "Full source file name",
  type: "string",
  required: true,
  comments: "The key of the source object",
  example: "path/to/source/file.txt",
});

export const destinationFileNameInputField = input({
  key: "destinationFileName",
  label: "Destination File Name",
  placeholder: "Full destination file name",
  type: "string",
  required: true,
  comments: "The key of the destination object",
  example: "path/to/destination/file.txt",
});

export const prefixInputField = input({
  key: "prefix",
  label: "Prefix",
  placeholder: "Prefix",
  type: "string",
  required: false,
  default: "",
  comments: "List only objects prefixed with this string",
  example: "path/to/directory/",
});
