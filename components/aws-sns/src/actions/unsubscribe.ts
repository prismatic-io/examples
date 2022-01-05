import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion, subscriptionArn, connectionInput } from "../inputs";

export const unsubscribe = action({
  display: {
    label: "Unsubscribe from a Topic",
    description: "Unsubscribe from an Amazon SNS Topic",
  },
  perform: async (context, params) => {
    const sns = await createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });
    return {
      data: await sns
        .unsubscribe({
          SubscriptionArn: util.types.toString(params.subscriptionArn),
        })
        .promise(),
    };
  },
  inputs: { awsRegion, subscriptionArn, awsConnection: connectionInput },
});

export default unsubscribe;
