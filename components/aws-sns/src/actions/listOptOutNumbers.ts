import { action, util } from "@prismatic-io/spectral";
import { authorization, createSNSClient } from "../auth";
import { awsRegion } from "../inputs";
import { SNS } from "aws-sdk";

interface Response {
  data: SNS.Types.ListPhoneNumbersOptedOutResponse;
}

const examplePayload: Response = {
  data: { phoneNumbers: ["15556164096", "18980994152", "18008988422"] },
};

export const listOptOutNumbers = action({
  display: {
    label: "List Opt Out Numbers",
    description: "Create an Amazon SNS Topic",
  },
  perform: async ({ credential }, params) => {
    const sns = await createSNSClient(
      credential,
      util.types.toString(params.awsRegion)
    );

    return {
      data: await sns.listPhoneNumbersOptedOut({}).promise(),
    };
  },
  inputs: { awsRegion },
  examplePayload,
  authorization,
});

export default listOptOutNumbers;
