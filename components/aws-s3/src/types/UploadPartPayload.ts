import { UploadPartCommandOutput } from "@aws-sdk/client-s3";

export interface UploadPartPayload extends UploadPartCommandOutput {
  part: {
    ETag: string;
    PartNumber: number;
  };
}
