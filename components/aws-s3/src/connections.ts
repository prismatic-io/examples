import { connection } from "@prismatic-io/spectral";
import { assumeRoleConnection } from "aws-utils";

export const accessKeySecretPair = connection({
  key: "apiKeySecret",
  display: {
    label: "AWS S3 Access Key and Secret",
    description:
      "Authenticates requests to AWS S3 using an API Key and Secret.",
  },
  inputs: {
    accessKeyId: {
      label: "Access Key ID",
      placeholder: "Access Key ID",
      type: "string",
      required: true,
      shown: true,
      comments: "An AWS IAM Access Key ID",
      example: "AKIAIOSFODNN7EXAMPLE",
    },
    secretAccessKey: {
      label: "Secret Access Key",
      placeholder: "Secret Access Key",
      type: "password",
      required: true,
      shown: true,
      comments: "An AWS IAM Secret Access Key",
      example: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    },
  },
});

export default [accessKeySecretPair, assumeRoleConnection];
