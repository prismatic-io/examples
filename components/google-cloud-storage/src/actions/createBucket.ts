import {
  connectionInput,
  multiRegional,
  userProject,
  location,
  bucketName,
  storageClass,
} from "../inputs";
import { googleStorageClient } from "../client";
import { action, util } from "@prismatic-io/spectral";

const validateStorageClass = (
  storageClass: string
): Record<string, boolean> => {
  switch (storageClass) {
    case "standard":
      return { standard: true };
    case "archived":
      return { archived: true };
    case "coldline":
      return { coldline: true };
    case "nearline":
      return { nearline: true };
    case "regional":
      return { regional: true };
  }
  throw new Error(`Unable to find storageClass matching ${storageClass}`);
};

export const createBucket = action({
  display: {
    label: "Create Bucket",
    description: "Create a new Bucket inside Google Cloud Storage",
  },
  inputs: {
    connection: connectionInput,
    bucketName,
    multiRegional,
    userProject,
    location,
    storageClass,
  },
  perform: async (context, params) => {
    const storage = googleStorageClient(params.connection);

    const [bucket] = await storage.createBucket(
      util.types.toString(params.bucketName),
      {
        userProject: util.types.toString(params.userProject) || undefined,
        location: util.types.toString(params.location) || undefined,
        multiRegional: util.types.toBool(params.multiRegional) || undefined,
        ...(validateStorageClass(util.types.toString(params.storageClass)) ||
          undefined),
      }
    );

    return {
      data: JSON.parse(JSON.stringify(bucket)),
    };
  },
});
