import querystring from "querystring";
import { action, input, util } from "@prismatic-io/spectral";
import { Upload } from "@aws-sdk/lib-storage";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { PassThrough } from "stream";
import { v4 as uuidv4 } from "uuid";
import { createS3Client } from "../auth";
import {
  accessKeyInput,
  acl,
  bucket,
  fileContents,
  objectKey,
  tagging,
} from "../inputs";
import {
  AbortMultipartUploadCommandOutput,
  CompleteMultipartUploadCommandOutput,
} from "@aws-sdk/client-s3";

interface UploadStreamExecutionState {
  uploadFinisher: Promise<
    CompleteMultipartUploadCommandOutput | AbortMultipartUploadCommandOutput
  >;
  fileStream: PassThrough;
}

const uploadIdInput = input({
  label: "Upload Stream ID",
  type: "string",
  required: true,
  comments:
    "The ID of the upload stream to write to. Generate this with the 'Create Stream' action.",
  clean: util.types.toString,
});

const createUploadStream = action({
  display: {
    label: "Upload Stream - Create Stream",
    description: "Create an upload stream to S3",
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    ...dynamicAccessAllInputs,
    objectKey,
    bucket,
    tagging,
    acl,
  },
  perform: async ({ executionState }, params) => {
    const s3 = await createS3Client({
      awsConnection: params.accessKey,
      awsRegion: params.awsRegion,
      dynamicAccessKeyId: params.dynamicAccessKeyId,
      dynamicSecretAccessKey: params.dynamicSecretAccessKey,
      dynamicSessionToken: params.dynamicSessionToken,
    });

    const tags = querystring.encode(
      (params.tagging || []).reduce(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {}
      )
    );

    // We'll use a UUID to uniquely identify this upload
    const uploadId = uuidv4();

    const fileStream = new PassThrough({ highWaterMark: 1024 * 1024 }); // 1 MB

    // You'll require queueSize * partSize bytes of memory to buffer the parts
    // 40 MB seems like a reasonable amount of memory to dedicate to buffers
    const upload = new Upload({
      client: s3,
      params: {
        ACL: params.acl || null,
        Bucket: params.bucket,
        Key: params.objectKey,
        Body: fileStream,
        Tagging: tags,
      },
    });

    // We write execution state this way rather than returning it from the action
    // because the Upload object is not serializable
    executionState[uploadId] = {
      uploadFinisher: upload.done(), // We issue a done() here by await it later, or the fileStream will not drain
      fileStream,
    };

    return { data: uploadId };
  },
  examplePayload: {
    data: "711B632B-C025-4E26-9E34-525822E3C0ED",
  },
});

const writeUploadStream = action({
  display: {
    label: "Upload Stream - Write Data",
    description: "Write to an upload stream",
  },
  inputs: {
    uploadId: uploadIdInput,
    fileContents,
  },
  perform: async ({ executionState }, params) => {
    const { fileStream } = executionState[
      params.uploadId
    ] as UploadStreamExecutionState;

    await new Promise((resolve) => {
      // If the stream returns false it represents that the amount of data in the stream has passed the
      // highWaterMark threshold and we should wait for a drain event from the stream before continuing to add more data
      if (!fileStream.write(params.fileContents.data)) {
        fileStream.once("drain", resolve);
      } else {
        resolve(true);
      }
    });

    return { data: null };
  },
});

const closeUploadStream = action({
  display: {
    label: "Upload Stream - Close Stream",
    description: "Close an upload stream",
  },
  inputs: {
    uploadId: uploadIdInput,
  },
  perform: async ({ executionState }, params) => {
    const { uploadFinisher, fileStream } = executionState[
      params.uploadId
    ] as UploadStreamExecutionState;
    fileStream.end();
    await uploadFinisher;
    return { data: null };
  },
});

export default { createUploadStream, writeUploadStream, closeUploadStream };
