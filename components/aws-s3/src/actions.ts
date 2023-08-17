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
  acl,
} from "./inputs";
import querystring from "querystring";
import { KeyValuePair, action, input, util } from "@prismatic-io/spectral";
import { createS3Client } from "./auth";
import {
  CopyObjectCommand,
  CopyObjectCommandInput,
  CopyObjectOutput,
  DeleteObjectOutput,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectOutput,
  PutObjectCommand,
  PutObjectRequest,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  Part,
  ListBucketsCommand,
  ListPartsCommand,
} from "@aws-sdk/client-s3"; // ES Modules import
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import createTopic from "./sns/actions/createTopic";
import updateTopicPolicy from "./sns/actions/updateTopicPolicy";
import subscribeToTopic from "./sns/actions/subscribeToTopic";
import unsubscribeFromTopic from "./sns/actions/unsubscribeFromTopic";
import bucketEventTriggerConfiguration from "./sns/actions/bucketEventTriggerConfiguration";

const listBuckets = action({
  display: {
    label: "List Buckets",
    description: "List all buckets in an AWS account",
  },
  perform: async (context, { awsRegion, accessKey }) => {
    const s3 = createS3Client(accessKey, awsRegion);
    const command = new ListBucketsCommand({});
    const response = await s3.send(command);
    return {
      data: response.Buckets,
    };
  },
  inputs: { awsRegion, accessKey: accessKeyInput },
});

/*
  Implementation of the S3 CopyObject API
  https://docs.aws.amazon.com/AmazonS3/latest/API/API_CopyObject.html
*/
const copyObjectSampleOutput: CopyObjectOutput = {
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
      acl,
      awsRegion,
      accessKey,
      sourceBucket,
      destinationBucket,
      sourceKey,
      destinationKey,
    }
  ) => {
    const s3 = createS3Client(accessKey, awsRegion);
    const copyParameters: CopyObjectCommandInput = {
      ACL: acl || null,
      Bucket: destinationBucket,
      CopySource: `${sourceBucket}/${sourceKey}`,
      Key: destinationKey,
    };
    const command = new CopyObjectCommand(copyParameters);
    const response = await s3.send(command);
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
    acl,
  },
  examplePayload: { data: copyObjectSampleOutput },
});

/*
  Implementation of the S3 DeleteObject API
  https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObject.html
*/
const deleteObjectSampleOutput: DeleteObjectOutput = {
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
    const s3 = createS3Client(accessKey, awsRegion);
    const deleteParameters = {
      Bucket: bucket,
      Key: objectKey,
    };
    const command = new DeleteObjectCommand(deleteParameters);
    const response = await s3.send(command);
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
    const s3 = createS3Client(accessKey, awsRegion);
    const getObjectParameters = {
      Bucket: bucket,
      Key: objectKey,
    };
    const command = new GetObjectCommand(getObjectParameters);
    const response = await s3.send(command);
    const objectBodyAsArray = await response.Body.transformToByteArray();
    const objectAsABuffer = Buffer.from(objectBodyAsArray);

    return {
      data: objectAsABuffer,
      contentType: response.ContentType,
    };
  },
  inputs: { awsRegion, accessKey: accessKeyInput, bucket, objectKey },
  examplePayload: {
    data: Buffer.from("Example File Contents"),
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
    const s3 = createS3Client(params.accessKey, params.awsRegion);

    const listObjectsV2Params = {
      Bucket: params.bucket,
      Prefix: params.prefix,
      MaxKeys: params.maxKeys || undefined,
      ContinuationToken: params.continuationToken || undefined,
    };
    const command = new ListObjectsV2Command(listObjectsV2Params);
    const response = await s3.send(command);
    return {
      data: params.includeMetadata
        ? response
        : (response.Contents || []).map(({ Key }) => Key),
    };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    bucket,
    prefix,
    maxKeys,
    continuationToken,
    includeMetadata: input({
      label: "Include Metadata",
      type: "boolean",
      required: true,
      default: "false",
      comments:
        "By default, this action returns a list of object keys. When this is set to true, additional metadata about each object is returned, along with pagination information.",
      clean: util.types.toBool,
    }),
  },
  examplePayload: listObjectOutput,
});

/*
  Implementation of the S3 PutObject API
  https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html
*/
const putObjectOutput: { data: PutObjectOutput } = {
  data: { ETag: "Example Tag", VersionId: "Example Version Id" },
};
const encodeTags = (tags: KeyValuePair[]): string => {
  return querystring.encode(
    (tags || []).reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
  );
};

const createMultipartUpload = action({
  display: {
    label: "Create Multipart Upload",
    description: "Create a multipart upload",
  },
  perform: async (
    context,
    { acl, awsRegion, accessKey, bucket, objectKey, tagging }
  ) => {
    const s3 = createS3Client(accessKey, awsRegion);
    const command = new CreateMultipartUploadCommand({
      ACL: acl || null,
      Bucket: bucket,
      Key: objectKey,
      Tagging: encodeTags(tagging),
    });
    const result = await s3.send(command);

    return { data: result };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    bucket,
    objectKey,
    tagging,
    acl,
  },
});

const abortMultipartUpload = action({
  display: {
    label: "Abort Multipart Upload",
    description: "Abort a multipart upload",
  },
  perform: async (
    context,
    { awsRegion, accessKey, bucket, objectKey, uploadId }
  ) => {
    const s3 = createS3Client(accessKey, awsRegion);
    const command = new AbortMultipartUploadCommand({
      Bucket: bucket,
      Key: objectKey,
      UploadId: uploadId,
    });
    const result = await s3.send(command);
    return { data: result };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    bucket,
    objectKey,
    uploadId: input({
      label: "Upload ID",
      type: "string",
      required: true,
      clean: util.types.toString,
    }),
  },
});

const completeMultipartUpload = action({
  display: {
    label: "Complete Multipart Upload",
    description: "Complete a multipart upload",
  },
  perform: async (
    context,
    { awsRegion, accessKey, bucket, objectKey, uploadId, parts }
  ) => {
    const s3 = createS3Client(accessKey, awsRegion);
    const command = new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: objectKey,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts as Part[] },
    });
    const result = await s3.send(command);
    return { data: result };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    bucket,
    objectKey,
    uploadId: input({
      label: "Upload ID",
      type: "string",
      required: true,
      clean: util.types.toString,
    }),
    parts: input({
      label: "Parts",
      type: "data",
      required: true,
    }),
  },
});

const listParts = action({
  display: {
    label: "List Parts",
    description: "List parts of a multipart upload",
  },
  perform: async (
    context,
    { awsRegion, accessKey, bucket, objectKey, uploadId }
  ) => {
    const s3 = createS3Client(accessKey, awsRegion);
    const command = new ListPartsCommand({
      Bucket: bucket,
      Key: objectKey,
      UploadId: uploadId,
    });
    const result = await s3.send(command);
    return { data: result };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    bucket,
    objectKey,
    uploadId: input({
      label: "Upload ID",
      type: "string",
      required: true,
      clean: util.types.toString,
    }),
  },
});

const uploadPart = action({
  display: {
    label: "Upload Part",
    description: "Upload a chunk of a multipart file upload",
  },
  perform: async (
    context,
    { awsRegion, accessKey, bucket, fileChunk, objectKey, uploadId, partNumber }
  ) => {
    const s3 = createS3Client(accessKey, awsRegion);
    const command = new UploadPartCommand({
      Bucket: bucket,
      Key: objectKey,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: fileChunk,
    });
    const result = await s3.send(command);
    return {
      data: {
        ...result,
        part: { ETag: result.ETag, PartNumber: partNumber },
      },
    };
  },
  inputs: {
    accessKey: accessKeyInput,
    awsRegion,
    bucket,
    objectKey,
    uploadId: input({
      label: "Upload ID",
      type: "string",
      required: true,
      clean: util.types.toString,
    }),
    partNumber: input({
      label: "Part Number",
      type: "string",
      required: true,
      clean: util.types.toInt,
    }),
    fileChunk: input({
      label: "File Chunk",
      type: "data",
      required: true,
      clean: (value) =>
        util.types.isBufferDataPayload(value) ? Buffer.from(value.data) : value,
    }),
  },
});

const putObject = action({
  display: {
    label: "Put Object",
    description: "Write an object to S3",
  },
  perform: async (
    context,
    { acl, awsRegion, accessKey, bucket, fileContents, objectKey, tagging }
  ) => {
    const s3 = createS3Client(accessKey, awsRegion);
    const { data, contentType } = fileContents;
    const tags = querystring.encode(
      (tagging || []).reduce(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {}
      )
    );
    const putParameters: PutObjectRequest = {
      ACL: acl || null,
      Bucket: bucket,
      Key: objectKey,
      Body: (data as unknown) as Blob,
      ContentType: contentType,
      Tagging: tags,
    };
    const command = new PutObjectCommand(putParameters);
    const response = await s3.send(command);
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
    acl,
  },
  examplePayload: putObjectOutput,
});

const generatePresignedUrl = action({
  display: {
    label: "Generate Presigned URL",
    description:
      "Generate a presigned URL that can be used to upload or download an object in S3",
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    bucket,
    objectKey,
    actionType: input({
      label: "Action (Download or Upload)",
      type: "string",
      comments: "Should this URL allow a user to upload or download an object?",
      clean: util.types.toString,
      required: true,
      default: "download",
      model: [
        { label: "Download", value: "download" },
        { label: "Upload", value: "upload" },
      ],
    }),
    expirationSeconds: input({
      label: "Expiration Seconds",
      type: "string",
      required: true,
      default: "3600",
      comments: "This presigned URL will expire in this many seconds",
      clean: util.types.toInt,
    }),
  },
  perform: async (context, params) => {
    const s3 = createS3Client(params.accessKey, params.awsRegion);
    const commandType =
      params.actionType === "download" ? GetObjectCommand : PutObjectCommand;
    const command = new commandType({
      Bucket: params.bucket,
      Key: params.objectKey,
    });
    return {
      data: await getSignedUrl(s3, command, {
        expiresIn: params.expirationSeconds,
      }),
    };
  },
  examplePayload: {
    data:
      "https://my-bucket.s3.us-east-2.amazonaws.com/my-file.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256...",
  },
});

export const actions = {
  copyObject,
  deleteObject,
  getObject,
  listObjects,
  putObject,
  generatePresignedUrl,
  createTopic,
  updateTopicPolicy,
  subscribeToTopic,
  unsubscribeFromTopic,
  bucketEventTriggerConfiguration,
  createMultipartUpload,
  uploadPart,
  completeMultipartUpload,
  abortMultipartUpload,
  listBuckets,
  listParts,
};
