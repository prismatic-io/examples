import { input } from "@prismatic-io/spectral";

export const projectInputField = input({
  key: "project",
  label: "GCP Project ID",
  placeholder: "GCP Project ID",
  type: "string",
  required: true,
  comments:
    "Google Cloud Storage Buckets are associated with GCP projects. This is the ID (letters, numbers, and dashes) of the GCP project.",
  example: "my-sample-project-123",
});

export const bucketNameInputField = input({
  key: "bucketName",
  label: "Bucket Name",
  placeholder: "Bucket Name",
  type: "string",
  required: true,
  comments:
    "Buckets in Google Cloud Storage contain files, and can be configured in the GCP console. Bucket names contain only letters, numbers, and dashes.",
  example: "my-gcs-bucket",
});

export const sourceBucketNameInputField = input({
  key: "sourceBucketName",
  label: "Source Bucket",
  placeholder: "Source Bucket Name",
  type: "string",
  required: true,
  comments:
    "A Google Cloud Storage 'bucket' is a container where files are stored. The source bucket indicates the bucket containing the file you want to copy. If you are copying files within a single bucket, list the same bucket as the source and destination bucket.",
  example: "my-source-bucket",
});

export const destinationBucketNameInputField = input({
  key: "destinationBucketName",
  label: "Destination Bucket",
  placeholder: "Destination Bucket Name",
  type: "string",
  required: true,
  comments:
    "A Google Cloud Storage 'bucket' is a container where files are stored. The destination bucket indicates the bucket containing the file you want to copy. If you are copying files within a single bucket, list the same bucket as the source and destination bucket.",
  example: "my-destination-bucket",
});

export const fileContentsInputField = input({
  key: "fileContents",
  label: "File Contents",
  placeholder: "Output data from previous step, or a string, to write",
  type: "data",
  required: true,
  comments:
    "The contents to write to a file. This can be a string of text, it can be binary data (like an image or PDF) that was generated in a previous step.",
  example: "My File Contents",
});

export const fileNameInputField = input({
  key: "fileName",
  label: "File Name",
  placeholder: "Full file name",
  type: "string",
  required: true,
  comments:
    "A file is saved in a 'bucket'. This represents the file's path without a leading /",
  example: "path/to/file.txt",
});

export const sourceFileNameInputField = input({
  key: "sourceFileName",
  label: "Source File Name",
  placeholder: "Full source file name",
  type: "string",
  required: true,
  comments:
    "This represents the source file's path. Do not include a leading /.",
  example: "path/to/source/file.txt",
});

export const destinationFileNameInputField = input({
  key: "destinationFileName",
  label: "Destination File Name",
  placeholder: "Full destination file name",
  type: "string",
  required: true,
  comments:
    "This represents the destination file's path. Do not include a leading /.",
  example: "path/to/destination/file.txt",
});

export const prefixInputField = input({
  key: "prefix",
  label: "Prefix",
  placeholder: "Prefix",
  type: "string",
  required: false,
  default: "",
  comments:
    "List only files prefixed with this string. For example, if you only want files in a directory called 'unprocessed', you can enter 'unprocessed/'. If this is left blank, all files in the selected bucket will be listed.",
  example: "path/to/directory/",
});
