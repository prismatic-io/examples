import { input, util } from "@prismatic-io/spectral";
import { completeMultipartUploadExampleInput } from "./exampleInputs";
import { cleanUploads } from "./util";

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
  clean: util.types.toString,
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

export const fileName = input({
  label: "File Name",
  placeholder: "Full file name",
  type: "string",
  required: true,
  comments:
    "A file is saved in a 'bucket'. This represents the file's path without a leading /",
  example: "path/to/file.txt",
  clean: util.types.toString,
});

export const partNumber = input({
  label: "Part Number",
  type: "string",
  required: true,
  comments:
    "Uniquely identifies the position of the part within the larger multipart upload. partNumber is an integer with a mimimum value of 1 and a maximum value of 10,000.",
  example: "1",
  placeholder: "1",
  clean: util.types.toNumber,
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

export const uploadId = input({
  label: "Upload ID",
  type: "string",
  required: true,
  comments:
    "Indicates the multipart upload that this part is associated with. This is returned when the multipart upload is initiated.",
  example: "VXBsb2FkIElEIGZvciBlbHZpbmcncyBteS1tb3ZpZS5tMnRzIHVwbG9hZA",
  placeholder: "VXBsb2FkIElEIGZvciBlbHZpbmcncyBteS1tb3ZpZS5tMnRzIHVwbG9hZA",
  clean: util.types.toString,
});

export const contentType = input({
  label: "Content Type",
  type: "string",
  required: true,
  comments:
    "The content type of the file. This is used to determine how the file should be handled by the browser.",
  example: "image/png",
  placeholder: "image/png",
  clean: util.types.toString,
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
  example: `bXkvbGFzdC9wcm9jZXNzZWQvZmlsZS50eHQ`,
});

export const connectionInput = input({
  label: "Connection",
  type: "connection",
  required: true,
});

export const userProject = input({
  label: "User Project",
  type: "string",
  required: false,
  comments: "Specify the project that the user creating the bucket belongs to.",
  example: `my-example-project`,
});

export const location = input({
  label: "Location",
  type: "string",
  required: false,
  comments:
    "The location of the bucket. Object data for objects in the bucket resides in physical storage within this region. Defaults to 'US'. See Cloud Storage bucket locations for the authoritative list: https://cloud.google.com/storage/docs/locations",
  example: `US-EAST1`,
});

export const multiRegional = input({
  label: "Multi-Regional",
  type: "boolean",
  required: false,
  comments:
    "This flag will determine if your bucket will be available from  multiple regions.",
});

export const storageClass = input({
  label: "StorageClass Type",
  type: "string",
  required: true,
  model: [
    { label: "Standard", value: "standard" },
    { label: "Archived", value: "archived" },
    { label: "Coldline", value: "coldline" },
    { label: "Nearline", value: "nearline" },
    { label: "Regional", value: "regional" },
  ],
  comments: "This flag will determine the StorageClass your bucket will use.",
});

export const expirationTime = input({
  label: "Expiration Time",
  type: "string",
  required: false,
  comments:
    "This flag will determine the expiration time of the bucket. The value is in seconds.",
  example: "3600",
  default: "3600",
  clean: (value) => util.types.toInt(value, 3600),
});

export const fileMetadata = input({
  label: "File Metadata",
  type: "boolean",
  required: false,
  comments:
    "If true, the metadata of the file will be returned after saving the file. Get Access to the bucket is required.",
  default: "true",
  clean: util.types.toBool,
});

export const partUploads = input({
  label: "Part Uploads",
  type: "code",
  language: "json",
  required: true,
  comments:
    "A JSON array of part uploads. Each part upload should have a partNumber and a etag property. IMPORTANT: If one of the parts specified in the request is less than 5 MiB and is not the final part in the upload, you get a 400 Bad Request status code and the body of the error response has InvalidArgument in the Code element.",
  example: JSON.stringify([completeMultipartUploadExampleInput], null, 2),
  clean: cleanUploads,
});
