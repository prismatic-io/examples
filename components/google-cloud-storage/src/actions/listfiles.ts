import {
  bucketName,
  prefix,
  pageToken,
  maxResults,
  connectionInput,
} from "../inputs";
import { googleStorageClient } from "../client";
import { action, util } from "@prismatic-io/spectral";

export const listFiles = action({
  display: {
    label: "List Files",
    description: "List files in a Google Cloud Storage bucket",
  },
  inputs: {
    connection: connectionInput,
    bucketName,
    prefix,
    pageToken,
    maxResults,
  },
  perform: async (context, params) => {
    const storage = googleStorageClient(params.connection);
    const options = { prefix: util.types.toString(params.prefix) };
    const [files] = await storage
      .bucket(util.types.toString(params.bucketName))
      .getFiles({
        ...options,
        maxResults: util.types.toInt(params.maxResults) || undefined,
        pageToken: util.types.toString(params.pageToken) || undefined,
      });
    return {
      data: files.map((f) => f.name).filter((f) => !f.endsWith("/")), // Filter out directories; we just care about files
    };
  },
  examplePayload: {
    data: ["foo.yaml", "bar.xml", "dist/to/myfile.json"],
  },
});
