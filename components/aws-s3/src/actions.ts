import {
  accessKeyInput,
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
  maxKeys,
  continuationToken,
} from "./inputs";
import querystring from "querystring";
import { action, util } from "@prismatic-io/spectral";
import { S3 } from "aws-sdk";
import { createS3Client } from "./auth";

/*
  Implementation of the S3 CopyObject API
  https://docs.aws.amazon.com/AmazonS3/latest/API/API_CopyObject.html
*/
const copyObjectSampleOutput: S3.Types.CopyObjectOutput = {
  CopyObjectResult: { ETag: "Example", LastModified: new Date("2020-01-01") },
};
const copyObject = action({
  display: {
    label: "Copy Object",
    description: "Copy an object in S3 from one location to another",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      sourceBucket,
      destinationBucket,
      sourceKey,
      destinationKey,
    }
  ) => {
    const s3 = await createS3Client(accessKey, util.types.toString(awsRegion));
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
    accessKey: accessKeyInput,
    sourceBucket,
    destinationBucket,
    sourceKey,
    destinationKey,
  },
  examplePayload: { data: copyObjectSampleOutput },
});

/*
  Implementation of the S3 DeleteObject API
  https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObject.html
*/
const deleteObjectSampleOutput: S3.Types.DeleteObjectOutput = {
  DeleteMarker: true,
  VersionId: "3/L4kqtJlcpXroDTDmJ+rmSpXd3dIbrHY+MTRCxf3vjVBH40Nr8X8gdRQBpUMLUo",
  RequestCharged: "requestor",
};
const deleteObject = action({
  display: {
    label: "Delete Object",
    description: "Delete an Object within an S3 Bucket",
  },
  perform: async (context, { awsRegion, accessKey, bucket, objectKey }) => {
    const s3 = await createS3Client(accessKey, util.types.toString(awsRegion));
    const deleteParameters = {
      Bucket: util.types.toString(bucket),
      Key: util.types.toString(objectKey),
    };
    const response = await s3.deleteObject(deleteParameters).promise();
    return { data: response };
  },
  inputs: { awsRegion, accessKey: accessKeyInput, bucket, objectKey },
  examplePayload: {
    data: deleteObjectSampleOutput,
  },
});

/*
  Implementation of the S3 GetObject API
  https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html
*/
const getObject = action({
  display: {
    label: "Get Object",
    description: "Get the contents of an object",
  },
  perform: async (context, { awsRegion, accessKey, bucket, objectKey }) => {
    const s3 = await createS3Client(accessKey, util.types.toString(awsRegion));
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
  inputs: { awsRegion, accessKey: accessKeyInput, bucket, objectKey },
  examplePayload: {
    data: Buffer.from("Example"),
    contentType: "application/octet",
  },
});

/*
  Implementation of the S3 ListObjectsV2 API
  https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html
*/
const listObjectOutput: { data: string[] } = {
  data: ["Example Item 1", "Example Item 2", "Example Item 3"],
};

const listObjects = action({
  display: {
    label: "List Objects",
    description: "List Objects in a Bucket",
  },
  perform: async (context, params) => {
    const s3 = await createS3Client(
      params.accessKey,
      util.types.toString(params.awsRegion)
    );

    const response = await s3
      .listObjectsV2({
        Bucket: util.types.toString(params.bucket),
        Prefix: util.types.toString(params.prefix),
        MaxKeys: util.types.toInt(params.maxKeys) || undefined,
        ContinuationToken:
          util.types.toString(params.continuationToken) || undefined,
      })
      .promise();
    return {
      data: response.Contents.map(({ Key }) => Key),
    };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    bucket,
    prefix,
    maxKeys,
    continuationToken,
  },
  examplePayload: listObjectOutput,
});

/*
  Implementation of the S3 PutObject API
  https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html
*/
const putObjectOutput: { data: S3.Types.PutObjectOutput } = {
  data: { ETag: "Example Tag", VersionId: "Example Version Id" },
};
const putObject = action({
  display: {
    label: "Put Object",
    description: "Write an object to S3",
  },
  perform: async (
    context,
    { awsRegion, accessKey, bucket, fileContents, objectKey, tagging }
  ) => {
    const s3 = await createS3Client(accessKey, util.types.toString(awsRegion));
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
    accessKey: accessKeyInput,
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
