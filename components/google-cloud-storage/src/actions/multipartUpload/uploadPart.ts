import {
  destinationBucketName,
  connectionInput,
  fileName,
  fileContents,
  uploadId,
  partNumber,
} from "../../inputs";
import { googleHttpClient } from "../../client";
import { action } from "@prismatic-io/spectral";
import { uploadPartPayloadExample } from "../../examplePayloads/multipartUpload";
import { cleanNumber } from "../../util";

export const uploadPartOfAMultipartUpload = action({
  display: {
    label: "Upload Part of a Multipart Upload",
    description: "Upload a part of a multipart upload to Google Cloud Storage",
  },
  inputs: {
    uploadId,
    fileName,
    fileContents,
    partNumber,
    destinationBucketName,
    connection: connectionInput,
  },
  perform: async (
    context,
    {
      destinationBucketName,
      connection,
      fileName,
      fileContents,
      uploadId,
      partNumber,
    }
  ) => {
    const client = await googleHttpClient(connection, destinationBucketName);
    const { data: fileData, contentType } = fileContents;
    const { data, headers } = await client.put(fileName, fileData, {
      headers: {
        "Content-Type": contentType,
      },
      params: {
        uploadId,
        partNumber,
      },
    });

    const etag = headers["etag"];

    return {
      data: {
        PartNumber: partNumber,
        ETag: etag.replace(/"/g, ""),
      },
    };
  },
  examplePayload: {
    data: uploadPartPayloadExample,
  },
});
