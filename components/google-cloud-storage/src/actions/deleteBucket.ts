import { bucketName, connectionInput } from "../inputs";
import { googleStorageClient } from "../client";
import { action, util } from "@prismatic-io/spectral";

export const deleteBucket = action({
  display: {
    label: "Delete Bucket",
    description: "Delete an existing Bucket from the Google Cloud Storage",
  },
  inputs: { bucketName, connection: connectionInput },

  perform: async (context, { bucketName, connection }) => {
    const storage = googleStorageClient(connection);
    const data = await storage.bucket(util.types.toString(bucketName)).delete();

    return { data: JSON.parse(JSON.stringify(data)) };
  },
});
