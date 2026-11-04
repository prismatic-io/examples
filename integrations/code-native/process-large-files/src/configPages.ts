import { DescribeRegionsCommand } from "@aws-sdk/client-ec2";
import awsS3 from "@prismatic-io/components-aws-s3";
import {
  configPage,
  configVar,
  Connection,
  connectionConfigVar,
  dataSourceConfigVar,
} from "@prismatic-io/spectral";
import { createEc2Client } from "./awsClient";

export const configPages = {
  Connections: configPage({
    elements: {
      // The Amazon S3 component's access key connection, from its npm package.
      // Its accessKeyId and secretAccessKey fields are what src/awsClient.ts reads.
      "S3 Connection": awsS3.connections.apiKeySecret({
        stableKey: "s3-connection",
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
      // The regions enabled for the connection's AWS account, rather than every region.
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
      // The Amazon S3 package lists the account's buckets; sorted by name here, as
      // the picker always has been.
      "S3 Bucket Name": dataSourceConfigVar({
        stableKey: "s3-bucket",
        dataSourceType: "picklist",
        perform: async (context) => {
          const { result } = await awsS3.dataSources.selectBucket.perform({
            accessKey: context.configVars["S3 Connection"] as Connection,
          });
          const bucketNames = result
            .map((bucket) => (typeof bucket === "string" ? bucket : bucket.key))
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
