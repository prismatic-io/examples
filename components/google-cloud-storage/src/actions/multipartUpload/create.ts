import {
  destinationBucketName,
  connectionInput,
  fileName,
  contentType,
} from "../../inputs";
import { googleHttpClient } from "../../client";
import { action, util } from "@prismatic-io/spectral";
import { createMultipartUploadPayloadExample } from "../../examplePayloads/multipartUpload";
import { convertXMLToJSON } from "../../util";

export const createMultipartUpload = action({
  display: {
    label: "Create Multipart Upload",
    description: "Create a multipart upload for a file in Google Cloud Storage",
  },
  inputs: {
    fileName,
    contentType,
    destinationBucketName,
    connection: connectionInput,
  },
  perform: async (
    context,
    { destinationBucketName, connection, fileName, contentType }
  ) => {
    const client = await googleHttpClient(connection, destinationBucketName);
    const { data } = await client.post(`${fileName}?uploads`, null, {
      headers: {
        "Content-Length": 0,
        Date: new Date().toUTCString(),
        "Content-Type": contentType,
      },
    });

    return {
      data: convertXMLToJSON(data),
    };
  },
  examplePayload: {
    data: createMultipartUploadPayloadExample,
  },
});
