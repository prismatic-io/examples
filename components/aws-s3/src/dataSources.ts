import { dataSource } from "@prismatic-io/spectral";
import { createS3Client } from "./auth";
import { accessKeyInput } from "./inputs";
import { awsRegions, dynamicAccessAllInputs } from "aws-utils";
import { ListBucketsCommand } from "@aws-sdk/client-s3"; // ES Modules import

const selectRegion = dataSource({
  display: {
    label: "Select AWS Region",
    description: "Select an AWS region",
  },
  dataSourceType: "picklist",
  perform: async (context, params) => {
    return Promise.resolve({
      result: awsRegions.map((region) => ({ label: region, key: region })),
    });
  },
  inputs: {},
});

const selectBucket = dataSource({
  display: {
    label: "Select Bucket",
    description: "Choose a bucket from a list",
  },
  dataSourceType: "picklist",
  perform: async (context, params) => {
    const s3 = await createS3Client({
      awsConnection: params.accessKey,
      awsRegion: "",
      dynamicAccessKeyId: params.dynamicAccessKeyId,
      dynamicSecretAccessKey: params.dynamicSecretAccessKey,
      dynamicSessionToken: params.dynamicSessionToken,
    });
    const command = new ListBucketsCommand({});
    const response = await s3.send(command);
    return {
      result: response.Buckets.map((bucket) => ({
        label: bucket.Name,
        key: bucket.Name,
      })),
    };
  },
  inputs: { accessKey: accessKeyInput, ...dynamicAccessAllInputs },
});

export default { selectBucket, selectRegion };
