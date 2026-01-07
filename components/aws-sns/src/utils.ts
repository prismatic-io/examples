import {
  ListSubscriptionsByTopicCommand,
  type ListSubscriptionsByTopicResponse,
  ListTopicsCommand,
  type ListTopicsResponse,
  type SNSClient,
} from "@aws-sdk/client-sns";
import { ActionContext, util } from "@prismatic-io/spectral";
import { toOptionalString } from "aws-utils";
import MessageValidator from "sns-validator";
import { createClient } from "@prismatic-io/spectral/dist/clients/http";
import { Store } from "./interfaces/Store";
import { STORE_KEY } from "./constants";

export const cleanStringInput = toOptionalString;

export const lowerCaseHeaders = (
  headers: Record<string, string>
): Record<string, string> =>
  Object.entries(headers).reduce((result, [key, val]) => {
    return Object.assign(result, { [key.toLowerCase()]: val });
  }, {});

export const fetchTopics = async (
  sns: SNSClient,
  fetchAllTopics: boolean,
  nextToken: string | undefined
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
  nextToken: string | undefined
) => {
  const listSubscriptionsByTopicParams = {
    TopicArn: topicArn,
    NextToken: fetchAllSubscriptions ? undefined : nextToken,
  };
  const command = new ListSubscriptionsByTopicCommand(
    listSubscriptionsByTopicParams
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

export const webhookPerformFn = async (
  { logger, debug: { enabled: debug } },
  payload,
  { parseMessage }
) => {
  const validator = new MessageValidator();
  const originalHeaders = payload.headers;
  payload.headers = lowerCaseHeaders(payload.headers);

  const _parseMessage =
    payload.headers["x-amz-sns-message-type"] === "Notification" &&
    util.types.toBool(parseMessage);

  const validateMessage = async ({ rawBody: { data }, headers }) => {
    if (headers["x-amz-sns-rawdelivery"] === "true") {
      return _parseMessage
        ? JSON.parse(util.types.toString(data) || "{}")
        : util.types.toString(data);
    }
    return await new Promise((resolve, reject) => {
      validator.validate(util.types.toString(data), (error, message) => {
        if (error) {
          logger.error(
            `SNS Message could not be verified with error: ${error}`
          );
          return reject(error);
        }
        return resolve(message);
      });
    });
  };

  const message = await validateMessage(payload);

  //FIXME - Is there a way to get rid of the usage of let here?
  let branch = "";

  const messageType = payload.headers["x-amz-sns-message-type"];
  const client = createClient({
    baseUrl: message.SubscribeURL,
    debug,
  });
  switch (messageType) {
    case "SubscriptionConfirmation":
      await client.get("");
      branch = "Subscribe";
      break;
    case "UnsubscribeConfirmation":
      await client.get("");
      branch = "Unsubscribe";
      break;
    case "Notification":
      branch = "Notification";
      break;
    default:
      throw new Error(
        `Message type was not "Notification", "SubscriptionConfirmation" or "UnsubscribeConfirmation", but "${messageType}" instead.`
      );
  }

  // Parse non-raw message data
  if (_parseMessage && payload.headers["x-amz-sns-rawdelivery"] !== "true") {
    try {
      message.Message = JSON.parse(util.types.toString(message.Message));
    } catch {
      throw new Error(
        `Received a message that is not valid JSON: ${message.Message}`
      );
    }
  }

  payload.headers = originalHeaders;

  return {
    // Return a deserialized message as payload.body.data
    branch,
    payload: {
      ...payload,
      body: {
        data: message,
      },
    },
  };
};

export const getPreviousTriggerState = (
  context: ActionContext,
  STATE_KEY: string
) => {
  const store = context[STORE_KEY] as Store;
  const subscriptionArn = store[STATE_KEY]?.subscriptionArn;
  const previousAwsRegion = store[STATE_KEY]?.previousAwsRegion;
  const previousTopicArn = store[STATE_KEY]?.previousTopicArn;

  return {
    existingSubscriptionArn: util.types.toString(subscriptionArn),
    previousAwsRegion: util.types.toString(previousAwsRegion),
    previousTopicArn: util.types.toString(previousTopicArn),
  };
};
