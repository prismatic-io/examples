import { bucketName, fileName, connectionInput } from "../inputs";
import { googleStorageClient } from "../client";
import { action, util } from "@prismatic-io/spectral";

export const downloadFile = action({
  display: {
    label: "Download File",
    description: "Download a file from Google Cloud Storage",
  },
  inputs: { fileName, bucketName, connection: connectionInput },
  perform: async (context, { bucketName, fileName, connection }) => {
    const storage = googleStorageClient(connection);
    const [metadata] = await storage
      .bucket(util.types.toString(bucketName))
      .file(util.types.toString(fileName))
      .getMetadata();
    const [contents] = await storage
      .bucket(util.types.toString(bucketName))
      .file(util.types.toString(fileName))
      .download();
    return {
      data: contents,
      contentType: metadata.contentType,
    };
  },
  examplePayload: {
    data: Buffer.from("File Contents"),
    contentType: "text/plain",
  },
});
