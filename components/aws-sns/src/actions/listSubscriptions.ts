import { action, util } from "@prismatic-io/spectral";
import { authorization, createSNSClient } from "../auth";
import { awsRegion, topicArn } from "../inputs";
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
  perform: async ({ credential }, params) => {
    const sns = await createSNSClient(
      credential,
      util.types.toString(params.awsRegion)
    );

    return {
      data: await sns
        .listSubscriptionsByTopic({
          TopicArn: util.types.toString(params.topicArn),
        })
        .promise(),
    };
  },
  inputs: { awsRegion, topicArn },
  examplePayload,
  authorization,
});

export default listSubscriptions;
