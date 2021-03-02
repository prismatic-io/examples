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
import querystring from "querystring";
import {
  action,
  util,
  PerformDataStructureReturn,
} from "@prismatic-io/spectral";
import { S3 } from "aws-sdk";
import { createS3Client } from "./auth";

interface S3ActionOutput extends PerformDataStructureReturn {
  data:
    | S3.Types.CopyObjectOutput
    | string[]
    | S3.Types.GetObjectOutput
    | S3.Types.PutObjectOutput;
}

const copyObjectOutput: S3ActionOutput = {
  data: {
    CopyObjectResult: { ETag: "Example", LastModified: new Date("2020-01-01") },
  },
};
const copyObject = action({
  key: "copyObject",
  display: {
    label: "Copy Object",
    description: "Copy an object in S3 from one location to another",
  },
  perform: async (
    { credential },
    { awsRegion, sourceBucket, destinationBucket, sourceKey, destinationKey }
  ) => {
    const s3 = await createS3Client(credential, awsRegion);
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
  examplePayload: copyObjectOutput,
});

const deleteObject = action({
  key: "deleteObject",
  display: {
    label: "Delete Object",
    description: "Delete an Object within an S3 Bucket",
  },
  perform: async ({ credential }, { awsRegion, bucket, objectKey }) => {
    const s3 = await createS3Client(credential, awsRegion);
    const deleteParameters = {
      Bucket: bucket,
      Key: objectKey,
    };
    await s3.deleteObject(deleteParameters).promise();
  },
  inputs: [awsRegionInputField, bucketInputField, keyInputField],
});

const getObjectOutput: S3ActionOutput & S3.Types.GetObjectOutput = {
  data: { Body: Buffer.from("Example"), ContentType: "application/octet" },
};
const getObject = action({
  key: "getObject",
  display: {
    label: "Get Object",
    description: "Get the contents of an object",
  },
  perform: async ({ credential }, { awsRegion, bucket, objectKey }) => {
    const s3 = await createS3Client(credential, awsRegion);
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
  examplePayload: getObjectOutput,
});

const listObjectOutput: S3ActionOutput = {
  data: ["Example Item 1", "Example Item 2", "Example Item 3"],
};
/* Maybe FIXME?: This caps off at 1000 objects */
const listObjects = action({
  key: "listObjects",
  display: {
    label: "List Objects",
    description: "List Objects in a Bucket",
  },
  perform: async ({ credential }, { awsRegion, bucket, prefix }) => {
    const s3 = await createS3Client(credential, awsRegion);
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
  examplePayload: listObjectOutput,
});

const putObjectOutput: S3ActionOutput = {
  data: { ETag: "Example Tag", VersionId: "Example Version Id" },
};
const putObject = action({
  key: "putObject",
  display: {
    label: "Put Object",
    description: "Write an object to S3",
  },
  perform: async (
    { credential },
    { awsRegion, bucket, fileContents, objectKey, tagging }
  ) => {
    const s3 = await createS3Client(credential, awsRegion);
    const { data, contentType } = util.types.toData(fileContents);
    const tags = querystring.encode(
      (tagging || {}).reduce(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {}
      )
    );
    const putParameters: S3.PutObjectRequest = {
      Bucket: bucket,
      Key: objectKey,
      Body: data,
      ContentType: contentType,
      Tagging: tags,
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
  examplePayload: putObjectOutput,
});

export const actions = {
  ...copyObject,
  ...deleteObject,
  ...getObject,
  ...listObjects,
  ...putObject,
};
