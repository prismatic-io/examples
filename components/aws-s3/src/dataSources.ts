import { dataSource } from "@prismatic-io/spectral";
import { createS3Client } from "./auth";
import { accessKeyInput, awsRegion } from "./inputs";
import awsRegions from "./aws-regions.json";
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
    const s3 = createS3Client(params.accessKey, params.awsRegion);
    const command = new ListBucketsCommand({});
    const response = await s3.send(command);
    return {
      result: response.Buckets.map((bucket) => ({
        label: bucket.Name,
        key: bucket.Name,
      })),
    };
  },
  inputs: { awsRegion, accessKey: accessKeyInput },
});

export default { selectBucket, selectRegion };
