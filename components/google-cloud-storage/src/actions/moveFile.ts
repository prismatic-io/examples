import {
  sourceBucketName,
  destinationBucketName,
  sourceFileName,
  destinationFileName,
  connectionInput,
} from "../inputs";
import { googleStorageClient } from "../client";
import { action, util } from "@prismatic-io/spectral";

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
    connection: connectionInput,
  },

  perform: async (
    context,
    {
      sourceBucketName,
      destinationBucketName,
      sourceFileName,
      destinationFileName,
      connection,
    }
  ) => {
    const storage = googleStorageClient(connection);
    await storage
      .bucket(util.types.toString(sourceBucketName))
      .file(util.types.toString(sourceFileName))
      .move(
        storage
          .bucket(util.types.toString(destinationBucketName))
          .file(util.types.toString(destinationFileName))
      );

    return { data: null };
  },
});
