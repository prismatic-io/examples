import {
  destinationBucketName,
  connectionInput,
  uploadId,
  fileName,
  partUploads,
} from "../../inputs";
import { googleHttpClient } from "../../client";
import { action } from "@prismatic-io/spectral";
import { convertJSObjectToXML, convertXMLToJSON } from "../../util";
import { completeMultipartUploadPayloadExample } from "../../examplePayloads/multipartUpload";

export const completeMultipartUpload = action({
  display: {
    label: "Complete Multipart Upload",
    description:
      "Completes a multipart upload for a file in Google Cloud Storage",
  },
  inputs: {
    partUploads,
    fileName,
    uploadId,
    destinationBucketName,
    connection: connectionInput,
  },
  perform: async (
    context,
    { destinationBucketName, connection, fileName, uploadId, partUploads }
  ) => {
    const client = await googleHttpClient(connection, destinationBucketName);
    const expectedPartUploads = {
      CompleteMultipartUpload: {
        Part: partUploads,
      },
    };
    const jsonToXML = convertJSObjectToXML(expectedPartUploads);
    const { data } = await client.post(fileName, jsonToXML, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(jsonToXML),
      },
      params: {
        uploadId,
      },
    });

    return { data: convertXMLToJSON(data) };
  },
  examplePayload: {
    data: completeMultipartUploadPayloadExample,
  },
});
