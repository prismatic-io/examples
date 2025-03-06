import { DefaultConnectionDefinition } from "@prismatic-io/spectral";

export const assumeRoleConnection: DefaultConnectionDefinition = {
  key: "awsAssumeRole",
  display: {
    label: "AWS Role ARN",
    description: "Connect to AWS using an assumed role",
  },
  inputs: {
    roleARN: {
      label: "Role ARN",
      placeholder: "arn:aws:iam::OtherAccount-ID:role/assumed-role-name",
      type: "string",
      required: true,
      shown: true,
      comments: "An AWS IAM Role ARN",
      example: "arn:aws:iam::OtherAccount-ID:role/assumed-role-name",
    },
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
};
