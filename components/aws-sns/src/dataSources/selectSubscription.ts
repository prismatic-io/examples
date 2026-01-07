import { dataSource, type Element } from "@prismatic-io/spectral";
import { awsRegion } from "aws-utils";
import { connectionInput, topicArn } from "../inputs";
import { createSNSClient } from "../client";
import { fetchSubscriptions } from "../utils";

export const selectSubscription = dataSource({
  display: {
    label: "Select Subscription",
    description: "Select a subscription from the list of subscriptions",
  },
  inputs: {
    awsConnection: connectionInput,
    awsRegion: { ...awsRegion, dataSource: undefined, model: undefined }, // TODO: Model removed until inline data sources support complex inputs
    topicArn: { ...topicArn, dataSource: undefined },
  },
  perform: async ({ logger }, { awsConnection, awsRegion, topicArn }) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
    });

    const { Subscriptions: subscriptions } = await fetchSubscriptions(
      sns,
      topicArn,
      true,
      undefined
    );

    const result = subscriptions
      ? subscriptions.map<Element>((subscription) => ({
          label: `Endpoint: ${subscription.Endpoint}`,
          key: subscription.SubscriptionArn,
        }))
      : [];
    return { result };
  },
  dataSourceType: "picklist",
});
