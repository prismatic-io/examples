import { AssumeRoleConnection } from "../interfaces/AssumeRoleConnection";

export const assumeRoleConnection: AssumeRoleConnection = {
  key: "awsAssumeRole",
  label: "AWS Role ARN",
  comments: "Connect to AWS using an assumed role",
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
