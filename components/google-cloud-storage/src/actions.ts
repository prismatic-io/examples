import {
  bucketName,
  sourceBucketName,
  destinationBucketName,
  fileName,
  sourceFileName,
  destinationFileName,
  fileContents,
  project,
  prefix,
} from "./inputs";
import { authorization, googleStorageClient } from "./auth";
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
    project,
  },
  authorization,
  perform: async (
    { credential },
    { fileContents, bucketName, fileName, project }
  ) => {
    const storage = googleStorageClient(credential, project);
    const { data } = util.types.toData(fileContents);
    await storage
      .bucket(util.types.toString(bucketName))
      .file(util.types.toString(fileName))
      .save(data);
  },
});

export const downloadFile = action({
  display: {
    label: "Download File",
    description: "Download a file from Google Cloud Storage",
  },
  inputs: { fileName, bucketName, project },
  authorization,
  perform: async ({ credential }, { bucketName, fileName, project }) => {
    const storage = googleStorageClient(credential, project);
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
    project,
  },
  authorization,
  perform: async (
    { credential },
    {
      sourceBucketName,
      destinationBucketName,
      sourceFileName,
      destinationFileName,
      project,
    }
  ) => {
    const storage = googleStorageClient(credential, project);
    await storage
      .bucket(util.types.toString(sourceBucketName))
      .file(util.types.toString(sourceFileName))
      .copy(
        storage
          .bucket(util.types.toString(destinationBucketName))
          .file(util.types.toString(destinationFileName))
      );
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
    project,
  },
  authorization,
  perform: async (
    { credential },
    {
      sourceBucketName,
      destinationBucketName,
      sourceFileName,
      destinationFileName,
      project,
    }
  ) => {
    const storage = googleStorageClient(credential, project);
    await storage
      .bucket(util.types.toString(sourceBucketName))
      .file(util.types.toString(sourceFileName))
      .move(
        storage
          .bucket(util.types.toString(destinationBucketName))
          .file(util.types.toString(destinationFileName))
      );
  },
});

export const deleteFile = action({
  display: {
    label: "Delete File",
    description: "Delete a file from a Google Cloud Storage bucket",
  },
  inputs: { fileName, bucketName, project },
  authorization,
  perform: async ({ credential }, { bucketName, fileName, project }) => {
    const storage = googleStorageClient(credential, project);
    await storage
      .bucket(util.types.toString(bucketName))
      .file(util.types.toString(fileName))
      .delete();
  },
});

export const listFiles = action({
  display: {
    label: "List Files",
    description: "List files in a Google Cloud Storage bucket",
  },
  inputs: { bucketName, project, prefix },
  authorization,
  perform: async ({ credential }, { bucketName, project, prefix }) => {
    const storage = googleStorageClient(credential, project);
    const options = { prefix: util.types.toString(prefix) };
    const [files] = await storage
      .bucket(util.types.toString(bucketName))
      .getFiles(options);
    return {
      data: files.map((f) => f.name).filter((f) => !f.endsWith("/")), // Filter out directories; we just care about files
    };
  },
  examplePayload: {
    data: ["foo.yaml", "bar.xml", "dist/to/myfile.json"],
  },
});
