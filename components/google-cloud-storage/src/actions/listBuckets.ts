import { connectionInput } from "../inputs";
import { googleStorageClient } from "../client";
import { action } from "@prismatic-io/spectral";

export const listBuckets = action({
  display: {
    label: "List Buckets",
    description: "List buckets in a Google Cloud Storage bucket",
  },
  inputs: { connection: connectionInput },
  perform: async (context, params) => {
    const storage = googleStorageClient(params.connection);
    const [buckets] = await storage.getBuckets();

    return {
      data: JSON.parse(JSON.stringify(buckets)),
    };
  },
});
