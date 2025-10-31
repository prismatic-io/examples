import { action } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { topicArn, nextToken, connectionInput, fetchAllSubscriptions } from "../inputs";
import type { ListSubscriptionsByTopicResponse } from "@aws-sdk/client-sns";
import { fetchSubscriptions } from "../utils";
interface Response {
  data: ListSubscriptionsByTopicResponse;
}

const examplePayload: Response = {
  data: {
    Subscriptions: [
      {
        SubscriptionArn:
          "arn:aws:sns:us-east-2:123456789012:MyExampleTopic:00000000-00000000-00000000-00000000",
        Owner: "0123456789000",
        Protocol: "https",
        Endpoint: "https://example.com/",
        TopicArn: "arn:aws:sns:us-east-2:123456789012:MyExampleTopic",
      },
      {
        SubscriptionArn: "PendingConfirmation",
        Owner: "0123456789000",
        Protocol: "email",
        Endpoint: "admin@example.com",
        TopicArn: "arn:aws:sns:us-east-2:123456789012:MyExampleTopic",
      },
    ],
  },
};

export const listSubscriptions = action({
  display: {
    label: "List Subscriptions",
    description: "Retrieve the subscriptions of an Amazon SNS Topic",
  },
  perform: async (context, {
    awsConnection,
    awsRegion,
    topicArn,
    nextToken,
    fetchAllSubscriptions
  }) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
    });
    const response = await fetchSubscriptions(sns, topicArn, fetchAllSubscriptions, nextToken);

    return {
      data: response,
    };
  },
  inputs: { awsConnection: connectionInput, awsRegion, topicArn, fetchAllSubscriptions, nextToken, },
  examplePayload,
});

export default listSubscriptions;
