import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion, topicArn, nextToken, connectionInput } from "../inputs";
import { SNS } from "aws-sdk";
interface Response {
  data: SNS.Types.ListSubscriptionsByTopicResponse;
}

const examplePayload: Response = {
  data: {
    Subscriptions: [
      {
        SubscriptionArn: "arn:aws:Example Subscription Arn",
        Owner: "example_owner",
        Protocol: "EMAIL",
        Endpoint: "admin@example.io",
      },
    ],
  },
};

export const listSubscriptions = action({
  display: {
    label: "List Subscriptions",
    description: "Retrieve the subscriptions of an Amazon SNS Topic",
  },
  perform: async (context, params) => {
    const sns = await createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });

    return {
      data: await sns
        .listSubscriptionsByTopic({
          TopicArn: util.types.toString(params.topicArn),
          NextToken: util.types.toString(params.nextToken),
        })
        .promise(),
    };
  },
  inputs: { awsRegion, topicArn, nextToken, awsConnection: connectionInput },
  examplePayload,
});

export default listSubscriptions;
