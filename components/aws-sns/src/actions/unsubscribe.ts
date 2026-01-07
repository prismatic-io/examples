import { action } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { subscriptionArn, connectionInput } from "../inputs";
import { UnsubscribeCommand } from "@aws-sdk/client-sns";
import { unsubscribeExamplePayload } from "../examplePayloads";

export const unsubscribe = action({
  display: {
    label: "Unsubscribe from a Topic",
    description: "Unsubscribe from an Amazon SNS Topic",
  },
  perform: async (
    { logger, debug: { enabled: debug } },
    { awsConnection, awsRegion, subscriptionArn }
  ) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
      debug,
      logger,
    });
    const unsubscribeParams = {
      SubscriptionArn: subscriptionArn,
    };
    const command = new UnsubscribeCommand(unsubscribeParams);
    const response = await sns.send(command);

    return {
      data: response,
    };
  },
  inputs: { awsRegion, subscriptionArn, awsConnection: connectionInput },
  examplePayload: unsubscribeExamplePayload,
});

export default unsubscribe;
