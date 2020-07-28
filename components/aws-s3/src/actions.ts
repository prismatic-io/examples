import {
  awsRegionInputField,
  bucketInputField,
  destinationBucketInputField,
  destinationKeyInputField,
  fileContentsInputField,
  keyInputField,
  prefixInputField,
  sourceBucketInputField,
  sourceKeyInputField,
  taggingInputField,
} from "./inputs";
import { action } from "@prismatic-io/spectral";
import { createS3Client } from "./auth";

const copyObject = action({
  key: "copyObject",
  display: {
    label: "Copy an object",
    description: "Copy an object in S3 from one location to another",
  },
  perform: async (
    { credential },
    { awsRegion, sourceBucket, destinationBucket, sourceKey, destinationKey }
  ) => {
    const s3 = createS3Client(credential, awsRegion);
    const copyParameters = {
      Bucket: destinationBucket,
      CopySource: `/${sourceBucket}/${sourceKey}`,
      Key: destinationKey,
    };
    const response = await s3.copyObject(copyParameters).promise();
    return {
      data: response,
    };
  },
  inputs: [
    awsRegionInputField,
    sourceBucketInputField,
    destinationBucketInputField,
    sourceKeyInputField,
    destinationKeyInputField,
  ],
});

const deleteObject = action({
  key: "deleteObject",
  display: {
    label: "Delete an Object in a Bucket",
    description: "Delete an Object within an S3 Bucket",
  },
  perform: async ({ credential }, { awsRegion, bucket, objectKey }) => {
    const s3 = createS3Client(credential, awsRegion);
    const deleteParameters = {
      Bucket: bucket,
      Key: objectKey,
    };
    await s3.deleteObject(deleteParameters).promise();
  },
  inputs: [awsRegionInputField, bucketInputField, keyInputField],
});

const getObject = action({
  key: "getObject",
  display: {
    label: "Get an object",
    description: "Get the contents of an object",
  },
  perform: async ({ credential }, { awsRegion, bucket, objectKey }) => {
    const s3 = createS3Client(credential, awsRegion);
    const getObjectParameters = {
      Bucket: bucket,
      Key: objectKey,
    };
    const response = await s3.getObject(getObjectParameters).promise();
    return {
      data: response.Body as Buffer,
      contentType: response.ContentType,
    };
  },
  inputs: [awsRegionInputField, bucketInputField, keyInputField],
});

/* Maybe FIXME?: This caps off at 1000 objects */
const listObjects = action({
  key: "listObjects",
  display: {
    label: "List Objects in a Bucket",
    description: "List Objects in a Bucket",
  },
  perform: async ({ credential }, { awsRegion, bucket, prefix }) => {
    const s3 = createS3Client(credential, awsRegion);
    const listParameters = {
      Bucket: bucket,
      Prefix: prefix,
    };
    const response = await s3.listObjectsV2(listParameters).promise();
    return {
      data: response.Contents.map(({ Key }) => Key),
    };
  },
  inputs: [awsRegionInputField, bucketInputField, prefixInputField],
});

const putObject = action({
  key: "putObject",
  display: {
    label: "Put an object",
    description: "Write an object to S3",
  },
  perform: async (
    { credential },
    { awsRegion, bucket, fileContents, objectKey, tagging }
  ) => {
    const s3 = createS3Client(credential, awsRegion);
    const putParameters = {
      Bucket: bucket,
      Key: objectKey,
      Body: fileContents.data || fileContents, // Write binary data or plain text
      Tagging: tagging,
    };
    const response = await s3.putObject(putParameters).promise();
    return {
      data: response,
    };
  },
  inputs: [
    awsRegionInputField,
    bucketInputField,
    fileContentsInputField,
    keyInputField,
    taggingInputField,
  ],
});

export const actions = {
  ...copyObject,
  ...deleteObject,
  ...getObject,
  ...listObjects,
  ...putObject,
};
