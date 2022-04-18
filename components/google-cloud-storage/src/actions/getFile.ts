import { bucketName, fileName, connectionInput } from "../inputs";
import { googleStorageClient } from "../client";
import { action, util } from "@prismatic-io/spectral";

export const getFile = action({
  display: {
    label: "Get File",
    description:
      "Get the information and metadata of a file from Google Cloud Storage",
  },
  inputs: { fileName, bucketName, connection: connectionInput },
  perform: async (context, { bucketName, fileName, connection }) => {
    const storage = googleStorageClient(connection);
    const [metadata] = await storage
      .bucket(util.types.toString(bucketName))
      .file(util.types.toString(fileName))
      .getMetadata();

    return {
      data: metadata,
      contentType: metadata.contentType,
    };
  },
  examplePayload: {
    data: Buffer.from("File Contents"),
    contentType: "text/plain",
  },
});
