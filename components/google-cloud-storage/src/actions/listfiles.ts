import {
  bucketName,
  prefix,
  pageToken,
  maxResults,
  connectionInput,
} from "../inputs";
import { googleStorageClient } from "../client";
import { action, util } from "@prismatic-io/spectral";

const listFilesV2 = action({
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
    const [files, pagination] = await storage
      .bucket(util.types.toString(params.bucketName))
      .getFiles({
        prefix: util.types.toString(params.prefix),
        maxResults: util.types.toInt(params.maxResults) || undefined,
        pageToken: util.types.toString(params.pageToken) || undefined,
      });
    return {
      data: {
        files: files.map((f) => f.name).filter((f) => !f.endsWith("/")), // Filter out directories; we just care about files
        pagination,
      },
    };
  },
  examplePayload: {
    data: {
      files: ["path/to/foo.yaml", "path/to/bar.xml", "path/to/myfile.json"],
      pagination: {
        pageToken: "bXkvbGFzdC9wcm9jZXNzZWQvZmlsZS50eHQ=",
        maxResults: 1000,
        prefix: "path/to/",
      },
    },
  },
});

export default { listFilesV2 };
