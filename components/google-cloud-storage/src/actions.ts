import {
  bucketNameInputField,
  sourceBucketNameInputField,
  destinationBucketNameInputField,
  fileNameInputField,
  sourceFileNameInputField,
  destinationFileNameInputField,
  fileContentsInputField,
  projectInputField,
  prefixInputField,
} from "./inputs";
import { googleStorageClient } from "./auth";
import { action, util } from "@prismatic-io/spectral";

const saveFileAction = action({
  key: "saveFile",
  display: {
    label: "Save File",
    description: "Save a file to Google Cloud Storage",
  },
  inputs: [
    fileContentsInputField,
    fileNameInputField,
    bucketNameInputField,
    projectInputField,
  ],
  perform: async (
    { credential },
    { fileContents, bucketName, fileName, project }
  ) => {
    const storage = googleStorageClient(credential, project);
    const { data } = util.types.toData(fileContents);
    await storage.bucket(bucketName).file(fileName).save(data);
  },
});

const downloadFileAction = action({
  key: "downloadFile",
  display: {
    label: "Download File",
    description: "Download a file from Google Cloud Storage",
  },
  inputs: [fileNameInputField, bucketNameInputField, projectInputField],
  perform: async ({ credential }, { bucketName, fileName, project }) => {
    const storage = googleStorageClient(credential, project);
    const [metadata] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getMetadata();
    const [contents] = await storage
      .bucket(bucketName)
      .file(fileName)
      .download();
    return {
      data: contents,
      contentType: metadata.contentType,
    };
  },
  examplePayload: { data: "File Contents", contentType: "text/plain" },
});

const copyFileAction = action({
  key: "copyFile",
  display: {
    label: "Copy Files",
    description: "Copy a file from one Google Cloud Storage bucket to another",
  },
  inputs: [
    sourceBucketNameInputField,
    destinationBucketNameInputField,
    sourceFileNameInputField,
    destinationFileNameInputField,
    projectInputField,
  ],
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
      .bucket(sourceBucketName)
      .file(sourceFileName)
      .copy(storage.bucket(destinationBucketName).file(destinationFileName));
  },
});

const moveFileAction = action({
  key: "moveFile",
  display: {
    label: "Move File",
    description: "Move a file from one Google Cloud Storage bucket to another",
  },
  inputs: [
    sourceBucketNameInputField,
    destinationBucketNameInputField,
    sourceFileNameInputField,
    destinationFileNameInputField,
    projectInputField,
  ],
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
      .bucket(sourceBucketName)
      .file(sourceFileName)
      .move(storage.bucket(destinationBucketName).file(destinationFileName));
  },
});

const deleteFileAction = action({
  key: "deleteFile",
  display: {
    label: "Delete File",
    description: "Delete a file from a Google Cloud Storage bucket",
  },
  inputs: [fileNameInputField, bucketNameInputField, projectInputField],
  perform: async ({ credential }, { bucketName, fileName, project }) => {
    const storage = googleStorageClient(credential, project);
    await storage.bucket(bucketName).file(fileName).delete();
  },
});

const listFilesAction = action({
  key: "listFiles",
  display: {
    label: "List Files",
    description: "List files in a Google Cloud Storage bucket",
  },
  inputs: [bucketNameInputField, projectInputField, prefixInputField],
  perform: async ({ credential }, { bucketName, project, prefix }) => {
    const storage = googleStorageClient(credential, project);
    const options = { prefix };
    const [files] = await storage.bucket(bucketName).getFiles(options);
    return {
      data: files.map((f) => f.name).filter((f) => !f.endsWith("/")), // Filter out directories; we just care about files
    };
  },
  examplePayload: {
    data: [
      {
        acl: undefined,
        bucket: {},
        storage: {},
        kmsKeyName: "Example Key",
        userProject: "Example Project",
        signer: {},
        name: "Example",
        generation: 2,
        parent: "Example Parent",
      },
    ],
  },
});

export const actions = {
  ...saveFileAction,
  ...downloadFileAction,
  ...copyFileAction,
  ...moveFileAction,
  ...deleteFileAction,
  ...listFilesAction,
};
