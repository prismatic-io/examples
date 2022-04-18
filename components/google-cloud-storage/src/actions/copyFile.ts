import {
  sourceBucketName,
  destinationBucketName,
  sourceFileName,
  destinationFileName,
  connectionInput,
} from "../inputs";
import { googleStorageClient } from "../client";
import { action, util } from "@prismatic-io/spectral";

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
