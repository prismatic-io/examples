import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { topicArn, nextToken, connectionInput } from "../inputs";
import {
  ListSubscriptionsByTopicCommand,
  ListSubscriptionsByTopicResponse,
} from "@aws-sdk/client-sns";
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
  perform: async (context, params) => {
    const sns = await createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });
    const listSubscriptionsByTopicParams = {
      TopicArn: util.types.toString(params.topicArn),
      NextToken: util.types.toString(params.nextToken),
    };
    const command = new ListSubscriptionsByTopicCommand(
      listSubscriptionsByTopicParams,
    );
    const response = await sns.send(command);

    return {
      data: response,
    };
  },
  inputs: { awsRegion, topicArn, nextToken, awsConnection: connectionInput },
  examplePayload,
});

export default listSubscriptions;
