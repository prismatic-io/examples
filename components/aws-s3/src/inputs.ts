import { input } from "@prismatic-io/spectral";
import awsRegions from "./aws-regions.json";

export const objectKey = input({
  label: "Object Key",
  placeholder: "Object Key",
  type: "string",
  required: true,
  comments:
    "An object in S3 is a file that is saved in a 'bucket'. This represents the object's key (file path). Do not include a leading /.",
  example: "path/to/file.txt",
});

export const sourceKey = input({
  label: "Source Key",
  placeholder: "Source Key",
  type: "string",
  required: true,
  comments:
    "An object in S3 is a file that is saved in a 'bucket'. This represents the source object's key (file path). Do not include a leading /.",
  example: "path/to/source/file.txt",
});

export const destinationKey = input({
  label: "Destination Key",
  placeholder: "Destination Key",
  type: "string",
  required: true,
  comments:
    "An object in S3 is a file that is saved in a 'bucket'. This represents the destination object's key (file path). Do not include a leading /.",
  example: "path/to/destination/file.txt",
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

export const bucket = input({
  label: "Bucket Name",
  placeholder: "Name of an S3 Bucket",
  type: "string",
  required: true,
  comments:
    "An AWS S3 'bucket' is a container where files are stored. You can create a bucket from within the AWS console. Bucket names contain only letters, numbers, and dashes.",
  example: "my-s3-bucket-abc123",
});

export const sourceBucket = input({
  label: "Source Bucket Name",
  placeholder: "Source Bucket Name",
  type: "string",
  required: true,
  comments:
    "An AWS S3 'bucket' is a container where files are stored. The source bucket indicates the bucket containing the file you want to copy. If you are copying files within a single bucket, list the same bucket as the source and destination bucket.",
  example: "my-source-bucket",
});

export const destinationBucket = input({
  label: "Destination Bucket Name",
  placeholder: "Destination Bucket Name",
  type: "string",
  required: true,
  comments:
    "An AWS S3 'bucket' is a container where files are stored. The destination bucket indicates the bucket where you want a file to be stored. If you are copying files within a single bucket, list the same bucket as the source and destination bucket.",
  example: "my-destination-bucket",
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
