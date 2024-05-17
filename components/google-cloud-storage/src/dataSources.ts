import { connectionInput } from "./inputs";
import { googleStorageClient } from "./client";
import { dataSource } from "@prismatic-io/spectral";

export const selectBucket = dataSource({
  display: {
    label: "Select Bucket",
    description: "Select a Google Cloud Storage bucket from a dropdown menu",
  },
  inputs: { connection: connectionInput },
  dataSourceType: "picklist",
  perform: async (context, params) => {
    const storage = googleStorageClient(params.connection);
    const [buckets] = await storage.getBuckets();
    return {
      result: buckets
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .map<string>((bucket) => bucket.name),
    };
  },
});

export default { selectBucket };
