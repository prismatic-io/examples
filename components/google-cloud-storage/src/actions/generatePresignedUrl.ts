import {
  bucketName,
  fileName,
  connectionInput,
  expirationTime,
} from "../inputs";
import { googleStorageClient } from "../client";
import { action } from "@prismatic-io/spectral";

export const generatePresignedUrl = action({
  display: {
    label: "Generate Presigned URL",
    description:
      "Generate a presigned URL to upload a file in Google Cloud Storage",
  },
  inputs: {
    connection: connectionInput,
    fileName: {
      ...fileName,
      comments:
        "The file name to generate a presigned URL for. This should be the full file name, including any directories. For example, `my-directory/my-file.txt`",
    },
    bucketName,
    expirationTime,
  },
  perform: async (
    context,
    { bucketName, fileName, connection, expirationTime }
  ) => {
    const storage = googleStorageClient(connection);
    const options = {
      version: "v4" as any,
      action: "write" as any,
      expires: Date.now() + expirationTime * 1000, // 60 minutes by default
      contentType: "application/octet-stream",
    };

    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);
    return {
      data: url,
    };
  },
});
