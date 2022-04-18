import { pageToken, maxResults, connectionInput } from "../inputs";
import { googleStorageClient } from "../client";
import { action, util } from "@prismatic-io/spectral";

export const listBuckets = action({
  display: {
    label: "List Buckets",
    description: "List buckets in a Google Cloud Storage bucket",
  },
  inputs: {
    connection: connectionInput,
    pageToken,
    maxResults,
  },
  perform: async (context, params) => {
    const storage = googleStorageClient(params.connection);
    const [buckets] = await storage.getBuckets({
      maxResults: util.types.toInt(params.maxResults) || undefined,
      pageToken: util.types.toString(params.pageToken) || undefined,
    });

    return {
      data: JSON.parse(JSON.stringify(buckets)),
    };
  },
});
