import { input } from "@prismatic-io/spectral";

export const project = input({
  label: "GCP Project ID",
  placeholder: "GCP Project ID",
  type: "string",
  required: true,
  comments:
    "Google Cloud Storage Buckets are associated with GCP projects. This is the ID (letters, numbers, and dashes) of the GCP project.",
  example: "my-sample-project-123",
});

export const bucketName = input({
  label: "Bucket Name",
  placeholder: "Bucket Name",
  type: "string",
  required: true,
  comments:
    "Buckets in Google Cloud Storage contain files, and can be configured in the GCP console. Bucket names contain only letters, numbers, and dashes.",
  example: "my-gcs-bucket",
});

export const sourceBucketName = input({
  label: "Source Bucket",
  placeholder: "Source Bucket Name",
  type: "string",
  required: true,
  comments:
    "A Google Cloud Storage 'bucket' is a container where files are stored. The source bucket indicates the bucket containing the file you want to copy. If you are copying files within a single bucket, list the same bucket as the source and destination bucket.",
  example: "my-source-bucket",
});

export const destinationBucketName = input({
  label: "Destination Bucket",
  placeholder: "Destination Bucket Name",
  type: "string",
  required: true,
  comments:
    "A Google Cloud Storage 'bucket' is a container where files are stored. The destination bucket indicates the bucket containing the file you want to copy. If you are copying files within a single bucket, list the same bucket as the source and destination bucket.",
  example: "my-destination-bucket",
});

export const fileContents = input({
  label: "File Contents",
  placeholder: "Output data from previous step, or a string, to write",
  type: "data",
  required: true,
  comments:
    "The contents to write to a file. This can be a string of text, it can be binary data (like an image or PDF) that was generated in a previous step.",
  example: "My File Contents",
});

export const fileName = input({
  label: "File Name",
  placeholder: "Full file name",
  type: "string",
  required: true,
  comments:
    "A file is saved in a 'bucket'. This represents the file's path without a leading /",
  example: "path/to/file.txt",
});

export const sourceFileName = input({
  label: "Source File Name",
  placeholder: "Full source file name",
  type: "string",
  required: true,
  comments:
    "This represents the source file's path. Do not include a leading /.",
  example: "path/to/source/file.txt",
});

export const destinationFileName = input({
  label: "Destination File Name",
  placeholder: "Full destination file name",
  type: "string",
  required: true,
  comments:
    "This represents the destination file's path. Do not include a leading /.",
  example: "path/to/destination/file.txt",
});

export const prefix = input({
  label: "Prefix",
  placeholder: "Prefix",
  type: "string",
  required: false,
  default: "",
  comments:
    "List only files prefixed with this string. For example, if you only want files in a directory called 'unprocessed', you can enter 'unprocessed/'. If this is left blank, all files in the selected bucket will be listed.",
  example: "path/to/directory/",
});

export const maxResults = input({
  label: "Max Results",
  type: "string",
  required: false,
  comments:
    "Provide an integer value for the maximum amount of results that will be returned. Provide a value from 1 to 50.",
  example: `20`,
});

export const pageToken = input({
  label: "Page Token",
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
