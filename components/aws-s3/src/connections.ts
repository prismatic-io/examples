import { connection } from "@prismatic-io/spectral";
import { assumeRoleConnection } from "aws-utils";

export const accessKeySecretPair = connection({
  key: "apiKeySecret",
  display: {
    label: "AWS S3 Access Key and Secret",
    description: "Authenticates requests to AWS S3 using an API Key and Secret.",
  },
  inputs: {
    accessKeyId: {
      label: "Access Key ID",
      placeholder: "Enter AWS IAM Access Key ID",
      type: "string",
      required: true,
      shown: true,
      comments:
        "AWS IAM Access Key ID used for programmatic access. Create access keys in the [AWS IAM Console](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) under Security Credentials.",
      example: "AKIAIOSFODNN7EXAMPLE",
    },
    secretAccessKey: {
      label: "Secret Access Key",
      placeholder: "Enter AWS IAM Secret Access Key",
      type: "password",
      required: true,
      shown: true,
      comments:
        "AWS IAM Secret Access Key paired with the Access Key ID. <strong>Important:</strong> This value is only shown once when created in the [AWS IAM Console](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html).",
      example: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    },
  },
});

export default [accessKeySecretPair, assumeRoleConnection];
