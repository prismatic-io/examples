import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion, subscriptionArn, connectionInput } from "../inputs";
import { UnsubscribeCommand } from "@aws-sdk/client-sns";

export const unsubscribe = action({
  display: {
    label: "Unsubscribe from a Topic",
    description: "Unsubscribe from an Amazon SNS Topic",
  },
  perform: async (context, params) => {
    const sns = createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });
    const unsubscribeParams = {
      SubscriptionArn: util.types.toString(params.subscriptionArn),
    };
    const command = new UnsubscribeCommand(unsubscribeParams);
    const response = await sns.send(command);
    return {
      data: response,
    };
  },
  inputs: { awsRegion, subscriptionArn, awsConnection: connectionInput },
});

export default unsubscribe;
