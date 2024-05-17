import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { nextToken, connectionInput } from "../inputs";
import {
  ListPhoneNumbersOptedOutCommand,
  ListPhoneNumbersOptedOutResponse,
} from "@aws-sdk/client-sns";

interface Response {
  data: ListPhoneNumbersOptedOutResponse;
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
    const listPhoneNumbersOptedOutParams = {
      nextToken: util.types.toString(params.nextToken),
    };
    const command = new ListPhoneNumbersOptedOutCommand(
      listPhoneNumbersOptedOutParams
    );
    const response = await sns.send(command);

    return {
      data: response,
    };
  },
  inputs: { awsRegion, nextToken, awsConnection: connectionInput },
  examplePayload,
});

export default listOptOutNumbers;
