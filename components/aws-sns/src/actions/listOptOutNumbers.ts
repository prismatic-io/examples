import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion, nextToken, connectionInput } from "../inputs";
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
  perform: async (context, params) => {
    const sns = await createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });

    return {
      data: await sns
        .listPhoneNumbersOptedOut({
          nextToken: util.types.toString(params.nextToken),
        })
        .promise(),
    };
  },
  inputs: { awsRegion, nextToken, awsConnection: connectionInput },
  examplePayload,
});

export default listOptOutNumbers;
