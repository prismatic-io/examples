import {
  bucketName,
  sourceBucketName,
  destinationBucketName,
  fileName,
  sourceFileName,
  destinationFileName,
  fileContents,
  prefix,
  pageToken,
  maxResults,
  connectionInput,
} from "./inputs";
import { googleStorageClient } from "./client";
import { action, util } from "@prismatic-io/spectral";

export const saveFile = action({
  display: {
    label: "Save File",
    description: "Save a file to Google Cloud Storage",
  },
  inputs: {
    fileContents,
    fileName,
    bucketName,
    googleConnection: connectionInput,
  },
  perform: async (
    context,
    { fileContents, bucketName, fileName, googleConnection }
  ) => {
    const storage = googleStorageClient(googleConnection);
    const { data } = util.types.toData(fileContents);
    await storage
      .bucket(util.types.toString(bucketName))
      .file(util.types.toString(fileName))
      .save(data);
    return {
      data,
    };
  },
});

export const downloadFile = action({
  display: {
    label: "Download File",
    description: "Download a file from Google Cloud Storage",
  },
  inputs: { fileName, bucketName, googleConnection: connectionInput },
  perform: async (context, { bucketName, fileName, googleConnection }) => {
    const storage = googleStorageClient(googleConnection);
    const [metadata] = await storage
      .bucket(util.types.toString(bucketName))
      .file(util.types.toString(fileName))
      .getMetadata();
    const [contents] = await storage
      .bucket(util.types.toString(bucketName))
      .file(util.types.toString(fileName))
      .download();
    return {
      data: contents,
      contentType: metadata.contentType,
    };
  },
  examplePayload: {
    data: Buffer.from("File Contents"),
    contentType: "text/plain",
  },
});

export const copyFile = action({
  display: {
    label: "Copy Files",
    description: "Copy a file from one Google Cloud Storage bucket to another",
  },
  inputs: {
    sourceBucketName,
    destinationBucketName,
    sourceFileName,
    destinationFileName,
    googleConnection: connectionInput,
  },
  perform: async (
    context,
    {
      sourceBucketName,
      destinationBucketName,
      sourceFileName,
      destinationFileName,
      googleConnection,
    }
  ) => {
    const storage = googleStorageClient(googleConnection);

    return {
      data: await storage
        .bucket(util.types.toString(sourceBucketName))
        .file(util.types.toString(sourceFileName))
        .copy(
          storage
            .bucket(util.types.toString(destinationBucketName))
            .file(util.types.toString(destinationFileName))
        ),
    };
  },
});

export const moveFile = action({
  display: {
    label: "Move File",
    description: "Move a file from one Google Cloud Storage bucket to another",
  },
  inputs: {
    sourceBucketName,
    destinationBucketName,
    sourceFileName,
    destinationFileName,
    googleConnection: connectionInput,
  },

  perform: async (
    context,
    {
      sourceBucketName,
      destinationBucketName,
      sourceFileName,
      destinationFileName,
      googleConnection,
    }
  ) => {
    const storage = googleStorageClient(googleConnection);

    return {
      data: await storage
        .bucket(util.types.toString(sourceBucketName))
        .file(util.types.toString(sourceFileName))
        .move(
          storage
            .bucket(util.types.toString(destinationBucketName))
            .file(util.types.toString(destinationFileName))
        ),
    };
  },
});

export const deleteFile = action({
  display: {
    label: "Delete File",
    description: "Delete a file from a Google Cloud Storage bucket",
  },
  inputs: { fileName, bucketName, googleConnection: connectionInput },

  perform: async (context, { bucketName, fileName, googleConnection }) => {
    const storage = googleStorageClient(googleConnection);
    const data = await storage
      .bucket(util.types.toString(bucketName))
      .file(util.types.toString(fileName))
      .delete();

    return { data };
  },
});

export const listFiles = action({
  display: {
    label: "List Files",
    description: "List files in a Google Cloud Storage bucket",
  },
  inputs: {
    bucketName,
    googleConnection: connectionInput,
    prefix,
    pageToken,
    maxResults,
  },
  perform: async (context, params) => {
    const storage = googleStorageClient(params.googleConnection);
    const options = { prefix: util.types.toString(params.prefix) };
    const [files] = await storage
      .bucket(util.types.toString(params.bucketName))
      .getFiles({
        ...options,
        maxResults: util.types.toInt(params.maxResults) || undefined,
        pageToken: util.types.toString(params.pageToken) || undefined,
      });
    return {
      data: files.map((f) => f.name).filter((f) => !f.endsWith("/")), // Filter out directories; we just care about files
    };
  },
  examplePayload: {
    data: ["foo.yaml", "bar.xml", "dist/to/myfile.json"],
  },
});
