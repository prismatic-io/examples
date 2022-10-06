import { bucketName, fileName, connectionInput } from "../inputs";
import { googleStorageClient } from "../client";
import { action, util } from "@prismatic-io/spectral";

export const deleteFile = action({
  display: {
    label: "Delete File",
    description: "Delete a file from a Google Cloud Storage bucket",
  },
  inputs: { fileName, bucketName, connection: connectionInput },

  perform: async (context, { bucketName, fileName, connection }) => {
    const storage = googleStorageClient(connection);
    await storage
      .bucket(util.types.toString(bucketName))
      .file(util.types.toString(fileName))
      .delete();

    return { data: null };
  },
});
