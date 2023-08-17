import { action } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion, subscriptionArn, accessKeyInput } from "../../inputs";
import { UnsubscribeCommand } from "@aws-sdk/client-sns";

export const unsubscribeFromTopic = action({
  display: {
    label: "Unsubscribe from a SNS Topic",
    description:
      "Unsubscribe from an Amazon SNS Topic for S3 Event Notifications",
  },
  perform: async (context, { awsConnection, awsRegion, subscriptionArn }) => {
    const sns = createSNSClient({
      awsConnection,
      awsRegion,
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
  inputs: { awsRegion, subscriptionArn, awsConnection: accessKeyInput },
});

export default unsubscribeFromTopic;
