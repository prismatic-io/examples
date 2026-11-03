import { DescribeRegionsCommand } from "@aws-sdk/client-ec2";
import { ListBucketsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import {
  configPage,
  configVar,
  Connection,
  connectionConfigVar,
  dataSourceConfigVar,
} from "@prismatic-io/spectral";
import { createEc2Client, createS3Client } from "./awsClient";

export const configPages = {
  Connections: configPage({
    elements: {
      "S3 Connection": connectionConfigVar({
        stableKey: "s3-connection",
        dataType: "connection",
        icons: {
          avatarPath: "s3.png",
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
      }),
      "PostgreSQL Connection": connectionConfigVar({
        stableKey: "postgres-connection",
        dataType: "connection",
        icons: {
          avatarPath: "postgres.png",
        },
        inputs: {
          host: {
            label: "Host",
            placeholder: "Database Host",
            type: "string",
            required: true,
            shown: true,
            comments: "The hostname or IP address of the PostgreSQL server.",
            example: "localhost",
          },
          port: {
            label: "Port",
            placeholder: "Database Port",
            type: "string",
            required: true,
            shown: true,
            comments:
              "The port number on which the PostgreSQL server is listening.",
            example: "5432",
            default: "5432",
          },
          database: {
            label: "Database Name",
            placeholder: "Database Name",
            type: "string",
            required: true,
            shown: true,
            comments: "The name of the PostgreSQL database to connect to.",
            example: "mydatabase",
          },
          user: {
            label: "Username",
            placeholder: "Database Username",
            type: "string",
            required: true,
            shown: true,
            comments:
              "The username for authenticating with the PostgreSQL database.",
            example: "dbuser",
          },
          password: {
            label: "Password",
            placeholder: "Database Password",
            type: "password",
            required: true,
            shown: true,
            comments:
              "The password for authenticating with the PostgreSQL database.",
            example: "securepassword",
          },
        },
      }),
    },
  }),
  "AWS Region": configPage({
    elements: {
      "AWS Region": dataSourceConfigVar({
        stableKey: "aws-region",
        dataSourceType: "picklist",
        perform: async (context) => {
          const client = createEc2Client(
            context.configVars["S3 Connection"] as Connection,
          );
          const command = new DescribeRegionsCommand({});
          const response = await client.send(command);
          const menuOptions = (response.Regions || [])
            .map((region) => region.RegionName)
            .filter((val) => typeof val === "string")
            .filter(Boolean)
            .sort();
          return { result: menuOptions };
        },
      }),
    },
  }),
  "AWS S3 Bucket": configPage({
    elements: {
      "S3 Bucket Name": dataSourceConfigVar({
        stableKey: "s3-bucket",
        dataSourceType: "picklist",
        perform: async (context) => {
          const s3Client = createS3Client(
            context.configVars["S3 Connection"] as Connection,
            `${context.configVars["AWS Region"]}`,
          );
          const listBucketsCommand = new ListBucketsCommand({});
          const response = await s3Client.send(listBucketsCommand);
          const bucketNames = (response.Buckets || [])
            .map((bucket) => bucket.Name)
            .filter((val) => typeof val === "string")
            .filter(Boolean)
            .sort();
          return { result: bucketNames };
        },
      }),
    },
  }),
  Schedule: configPage({
    elements: {
      "Process Schedule": configVar({
        stableKey: "process-schedule",
        dataType: "schedule",
        description: "How often should the file processor run?",
      }),
    },
  }),
};
