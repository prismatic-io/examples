import { input } from "@prismatic-io/spectral";

export const projectInputField = input({
  key: "project",
  label: "GCP Project ID",
  placeholder: "GCP Project ID",
  type: "string",
  required: true,
});

export const bucketNameInputField = input({
  key: "bucketName",
  label: "Bucket Name",
  placeholder: "Bucket Name",
  type: "string",
  required: true,
});

export const sourceBucketNameInputField = input({
  key: "sourceBucketName",
  label: "Source Bucket",
  placeholder: "Source Bucket Name",
  type: "string",
  required: true,
});

export const destinationBucketNameInputField = input({
  key: "destinationBucketName",
  label: "Destination Bucket",
  placeholder: "Destination Bucket Name",
  type: "string",
  required: true,
});

export const fileContentsInputField = input({
  key: "fileContents",
  label: "File Contents",
  placeholder: "Output data from previous step, or a string, to write",
  type: "data",
  required: true,
  comments: "Binary file data or a string",
});

export const fileNameInputField = input({
  key: "fileName",
  label: "File Name",
  placeholder: "Full file name (e.g. path/to/file.txt)",
  type: "string",
  required: true,
});

export const sourceFileNameInputField = input({
  key: "sourceFileName",
  label: "Source File Name",
  placeholder: "Full source file name (e.g. path/to/file.txt)",
  type: "string",
  required: true,
});

export const destinationFileNameInputField = input({
  key: "destinationFileName",
  label: "Destination File Name",
  placeholder: "Full destination file name (e.g. path/to/file.txt)",
  type: "string",
  required: true,
});
