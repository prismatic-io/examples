import {
  ListSubscriptionsByTopicCommand,
  type ListSubscriptionsByTopicResponse,
  ListTopicsCommand,
  type ListTopicsResponse,
  type SNSClient,
} from "@aws-sdk/client-sns";
import { toOptionalString } from "aws-utils";

export const cleanStringInput = toOptionalString;

export const fetchTopics = async (
  sns: SNSClient,
  fetchAllTopics: boolean,
  nextToken: string | undefined,
) => {
  const listTopicParams = fetchAllTopics
    ? {}
    : {
        NextToken: nextToken,
      };

  const command = new ListTopicsCommand(listTopicParams);
  const response = await sns.send(command);

  if (fetchAllTopics) {
    const allTopics: ListTopicsResponse["Topics"] = response.Topics || [];
    let nextToken = response.NextToken || undefined;
    while (nextToken) {
      const command = new ListTopicsCommand({
        NextToken: nextToken,
      });
      const response = await sns.send(command);
      allTopics.push(...response.Topics);
      nextToken = response.NextToken;
    }
    response.Topics = allTopics;
    response.NextToken = undefined;
  }

  return response;
};

export const fetchSubscriptions = async (
  sns: SNSClient,
  topicArn: string,
  fetchAllSubscriptions: boolean,
  nextToken: string | undefined,
) => {
  const listSubscriptionsByTopicParams = {
    TopicArn: topicArn,
    NextToken: fetchAllSubscriptions ? undefined : nextToken,
  };
  const command = new ListSubscriptionsByTopicCommand(
    listSubscriptionsByTopicParams,
  );
  const response = await sns.send(command);

  if (fetchAllSubscriptions) {
    const allSubscriptions: ListSubscriptionsByTopicResponse["Subscriptions"] =
      response.Subscriptions || [];
    let nextToken = response.NextToken || undefined;
    while (nextToken) {
      const command = new ListSubscriptionsByTopicCommand({
        TopicArn: topicArn,
        NextToken: nextToken,
      });
      const response = await sns.send(command);
      allSubscriptions.push(...response.Subscriptions);
      nextToken = response.NextToken;
    }
    response.Subscriptions = allSubscriptions;
    response.NextToken = undefined;
  }

  return response;
};
