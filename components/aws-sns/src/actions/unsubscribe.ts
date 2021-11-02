import { action, util } from "@prismatic-io/spectral";
import { authorization, createSNSClient } from "../auth";
import { awsRegion, subscriptionArn } from "../inputs";

export const unsubscribe = action({
  display: {
    label: "Unsubscribe from a Topic",
    description: "Unsubscribe from an Amazon SNS Topic",
  },
  perform: async ({ credential }, params) => {
    const sns = await createSNSClient(
      credential,
      util.types.toString(params.awsRegion)
    );
    return {
      data: await sns
        .unsubscribe({
          SubscriptionArn: util.types.toString(params.subscriptionArn),
        })
        .promise(),
    };
  },
  inputs: { awsRegion, subscriptionArn },
  authorization,
});

export default unsubscribe;
