import { dataSource } from "@prismatic-io/spectral";
import { awsRegions } from "../data/awsRegions";

export const selectRegion = dataSource({
  display: {
    label: "Select AWS Region",
    description: "Select an AWS region",
  },
  dataSourceType: "picklist",
  perform: async () => {
    return Promise.resolve({
      result: awsRegions.map((region) => ({ label: region, key: region })),
    });
  },
  inputs: {},
});
