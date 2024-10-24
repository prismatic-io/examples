import { input, util } from "@prismatic-io/spectral";
import { awsRegions } from "../data/awsRegions";

export const awsRegion = input({
  label: "AWS Region",
  placeholder: "AWS Region",
  type: "string",
  required: false,
  comments:
    "AWS provides services in multiple regions, like us-west-2 or eu-west-1.",
  example: "us-east-1",
  model: [
    ...awsRegions.map((region) => {
      return {
        label: region,
        value: region,
      };
    }),
  ],
  clean: util.types.toString,
});
