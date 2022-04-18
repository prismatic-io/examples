import { bucketName, fileName, fileContents, connectionInput } from "../inputs";
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
    connection: connectionInput,
  },
  perform: async (
    context,
    { fileContents, bucketName, fileName, connection }
  ) => {
    const storage = googleStorageClient(connection);
    const { data } = util.types.toData(fileContents);
    await storage
      .bucket(util.types.toString(bucketName))
      .file(util.types.toString(fileName))
      .save(data);
    return {
      data,
    };
  },
});
