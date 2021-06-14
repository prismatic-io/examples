import {
  awsRegion,
  bucket,
  destinationBucket,
  destinationKey,
  fileContents,
  objectKey,
  prefix,
  sourceBucket,
  sourceKey,
  tagging,
} from "./inputs";
import querystring from "querystring";
import { action, util } from "@prismatic-io/spectral";
import { S3 } from "aws-sdk";
import { createS3Client } from "./auth";

interface S3ActionOutput {
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
  display: {
    label: "Copy Object",
    description: "Copy an object in S3 from one location to another",
  },
  perform: async (
    { credential },
    { awsRegion, sourceBucket, destinationBucket, sourceKey, destinationKey }
  ) => {
    const s3 = await createS3Client(credential, util.types.toString(awsRegion));
    const copyParameters = {
      Bucket: util.types.toString(destinationBucket),
      CopySource: `/${sourceBucket}/${sourceKey}`,
      Key: util.types.toString(destinationKey),
    };
    const response = await s3.copyObject(copyParameters).promise();
    return {
      data: response,
    };
  },
  inputs: {
    awsRegion,
    sourceBucket,
    destinationBucket,
    sourceKey,
    destinationKey,
  },
  examplePayload: copyObjectOutput,
});

const deleteObject = action({
  display: {
    label: "Delete Object",
    description: "Delete an Object within an S3 Bucket",
  },
  perform: async ({ credential }, { awsRegion, bucket, objectKey }) => {
    const s3 = await createS3Client(credential, util.types.toString(awsRegion));
    const deleteParameters = {
      Bucket: util.types.toString(bucket),
      Key: util.types.toString(objectKey),
    };
    await s3.deleteObject(deleteParameters).promise();
  },
  inputs: { awsRegion, bucket, objectKey },
});

const getObject = action({
  display: {
    label: "Get Object",
    description: "Get the contents of an object",
  },
  perform: async ({ credential }, { awsRegion, bucket, objectKey }) => {
    const s3 = await createS3Client(credential, util.types.toString(awsRegion));
    const getObjectParameters = {
      Bucket: util.types.toString(bucket),
      Key: util.types.toString(objectKey),
    };
    const response = await s3.getObject(getObjectParameters).promise();
    return {
      data: response.Body as Buffer,
      contentType: response.ContentType,
    };
  },
  inputs: { awsRegion, bucket, objectKey },
  examplePayload: {
    data: Buffer.from("Example"),
    contentType: "application/octet",
  },
});

const listObjectOutput: S3ActionOutput = {
  data: ["Example Item 1", "Example Item 2", "Example Item 3"],
};
/* Maybe FIXME?: This caps off at 1000 objects */
const listObjects = action({
  display: {
    label: "List Objects",
    description: "List Objects in a Bucket",
  },
  perform: async ({ credential }, { awsRegion, bucket, prefix }) => {
    const s3 = await createS3Client(credential, util.types.toString(awsRegion));
    const listParameters = {
      Bucket: util.types.toString(bucket),
      Prefix: util.types.toString(prefix),
    };
    const response = await s3.listObjectsV2(listParameters).promise();
    return {
      data: response.Contents.map(({ Key }) => Key),
    };
  },
  inputs: { awsRegion, bucket, prefix },
  examplePayload: listObjectOutput,
});

const putObjectOutput: S3ActionOutput = {
  data: { ETag: "Example Tag", VersionId: "Example Version Id" },
};
const putObject = action({
  display: {
    label: "Put Object",
    description: "Write an object to S3",
  },
  perform: async (
    { credential },
    { awsRegion, bucket, fileContents, objectKey, tagging }
  ) => {
    const s3 = await createS3Client(credential, util.types.toString(awsRegion));
    const { data, contentType } = util.types.toData(fileContents);
    const tags = querystring.encode(
      (tagging || []).reduce(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {}
      )
    );
    const putParameters: S3.PutObjectRequest = {
      Bucket: util.types.toString(bucket),
      Key: util.types.toString(objectKey),
      Body: data,
      ContentType: contentType,
      Tagging: tags,
    };
    const response = await s3.putObject(putParameters).promise();
    return {
      data: response,
    };
  },
  inputs: {
    awsRegion,
    bucket,
    fileContents,
    objectKey,
    tagging,
  },
  examplePayload: putObjectOutput,
});

export const actions = {
  copyObject,
  deleteObject,
  getObject,
  listObjects,
  putObject,
};
