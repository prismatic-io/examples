import { connection } from "@prismatic-io/spectral";
import { assumeRoleConnection } from "aws-utils";

export const accessKeySecretPair = connection({
  key: "apiKeySecret",
  display: {
    label: "AWS SNS Access Key and Secret",
    description:
      "Authenticates requests to Amazon SNS using an API Key and API Secret",
  },
  inputs: {
    accessKeyId: {
      label: "Access Key ID",
      placeholder: "Enter Access Key ID",
      type: "string",
      required: true,
      shown: true,
      comments:
        "An AWS IAM Access Key ID for authenticating with Amazon SNS. [Learn more](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)",
      example: "AKIAIOSFODNN7EXAMPLE",
    },
    secretAccessKey: {
      label: "Secret Access Key",
      placeholder: "Enter Secret Access Key",
      type: "password",
      required: true,
      shown: true,
      comments:
        "An AWS IAM Secret Access Key corresponding to the Access Key ID. [Learn more](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)",
      example: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    },
  },
});

export default [accessKeySecretPair, assumeRoleConnection];
