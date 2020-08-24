import {
  bucketNameInputField,
  sourceBucketNameInputField,
  destinationBucketNameInputField,
  fileNameInputField,
  sourceFileNameInputField,
  destinationFileNameInputField,
  fileContentsInputField,
  projectInputField,
} from "./inputs";
import { googleStorageClient } from "./auth";
import { action } from "@prismatic-io/spectral";

const saveFileAction = action({
  key: "saveFile",
  display: {
    label: "Save a file to Google Cloud Storage",
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
    const contentsToSave = fileContents.data || fileContents; // Write out binary data, or a string
    await storage.bucket(bucketName).file(fileName).save(contentsToSave);
  },
});

const downloadFileAction = action({
  key: "downloadFile",
  display: {
    label: "Download a file from Google Cloud Storage",
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
      data: contents as Buffer,
      contentType: metadata.contentType,
    };
  },
});

const copyFileAction = action({
  key: "copyFile",
  display: {
    label: "Copy files within Google Cloud Storage",
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

const deleteFileAction = action({
  key: "deleteFile",
  display: {
    label: "Delete a file within Google Cloud Storage",
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
    label: "List files in a Google Cloud Storage bucket",
    description: "List files in a Google Cloud Storage bucket",
  },
  inputs: [bucketNameInputField, projectInputField],
  perform: async ({ credential }, { bucketName, project }) => {
    const storage = googleStorageClient(credential, project);
    const [files] = await storage.bucket(bucketName).getFiles();
    return {
      data: files.map((f) => f.name),
    };
  },
});

export const actions = {
  ...saveFileAction,
  ...downloadFileAction,
  ...copyFileAction,
  ...deleteFileAction,
  ...listFilesAction,
};
