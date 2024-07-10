import {
  bucketName,
  fileName,
  fileContents,
  connectionInput,
  fileMetadata,
} from "../inputs";
import { googleStorageClient } from "../client";
import { action, util } from "@prismatic-io/spectral";

export const saveFile = action({
  display: {
    label: "Save File",
    description: "Save a file to Google Cloud Storage",
  },
  inputs: {
    fileContents,
    fileName,
    bucketName,
    fileMetadata,
    connection: connectionInput,
  },
  perform: async (
    context,
    { fileContents, bucketName, fileName, connection, fileMetadata }
  ) => {
    const storage = googleStorageClient(connection);
    const { data } = util.types.toData(fileContents);
    await storage.bucket(bucketName).file(fileName).save(data);

    if (fileMetadata) {
      const [metadata] = await storage
        .bucket(bucketName)
        .file(fileName)
        .getMetadata();
      return {
        data: metadata,
      };
    }
    return {
      data: "File saved successfully!",
    };
  },
});
