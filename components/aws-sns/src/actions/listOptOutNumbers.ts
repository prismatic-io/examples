import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { nextToken, connectionInput } from "../inputs";
import { ListPhoneNumbersOptedOutCommand } from "@aws-sdk/client-sns";
import { listOptOutNumbersExamplePayload } from "../examplePayloads";

export const listOptOutNumbers = action({
  display: {
    label: "List Opt Out Numbers",
    description: "List all opt out numbers",
  },
  perform: async (
    { logger, debug: { enabled: debug } },
    { awsConnection, awsRegion, nextToken }
  ) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
      debug,
      logger,
    });
    const listPhoneNumbersOptedOutParams = {
      nextToken: util.types.toString(nextToken),
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
  examplePayload: listOptOutNumbersExamplePayload,
});

export default listOptOutNumbers;
