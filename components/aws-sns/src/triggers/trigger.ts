import { trigger, util } from "@prismatic-io/spectral";
import { connectionInput, parseMessage, topicArn } from "../inputs";
import { snsExamplePayload } from "./exampleNotification";
import { getPreviousTriggerState, webhookPerformFn } from "../utils";
import { awsRegion } from "aws-utils/src/inputs/awsRegion";
import { createSNSClient } from "../client";
import { SubscribeCommand, UnsubscribeCommand } from "@aws-sdk/client-sns";
import { STORE_KEY } from "../constants";
import { Store } from "../interfaces/Store";

export const subscriptionTrigger = trigger({
  display: {
    label: "Manual Subscription",
    description:
      "Receive and validate webhook requests from SNS for manually configured webhook subscriptions.",
  },
  inputs: { parseMessage },
  scheduleSupport: "invalid",
  synchronousResponseSupport: "valid",
  allowsBranching: true,
  staticBranchNames: ["Notification", "Subscribe", "Unsubscribe"],
  examplePayload: {
    payload: snsExamplePayload,
    branch: "Notification",
  },
  perform: webhookPerformFn,
});

export const webhookLifecycleTrigger = trigger({
  display: {
    label: "Topic Webhook",
    description:
      "Receive notifications from an SNS topic. Automatically creates and manages a topic subscription when the instance is deployed, and removes the subscription when the instance is deleted.",
  },
  inputs: {
    parseMessage,
    awsConnection: connectionInput,
    awsRegion,
    topicArn,
  },
  scheduleSupport: "invalid",
  synchronousResponseSupport: "valid",
  allowsBranching: true,
  staticBranchNames: ["Notification", "Subscribe", "Unsubscribe"],
  examplePayload: {
    payload: snsExamplePayload,
    branch: "Notification",
  },
  perform: webhookPerformFn,
  webhookLifecycleHandlers: {
    create: async (context, { awsConnection, awsRegion, topicArn }) => {
      const sns = await createSNSClient({
        awsConnection,
        awsRegion,
        debug: context.debug.enabled,
        logger: context.logger,
      });
      const flowName = context.webhookUrls[context.flow.name];
      const triggerId = flowName.split("/").pop();
      const STATE_KEY = `${triggerId}:awsSnsTopicSubscription`;
      const { existingSubscriptionArn, previousAwsRegion, previousTopicArn } =
        getPreviousTriggerState(context, STATE_KEY);
      const isSameRegion = previousAwsRegion === awsRegion;
      const isSameTopic = previousTopicArn === topicArn;

      if (existingSubscriptionArn) {
        if (!isSameRegion || !isSameTopic) {
          context.logger.info(
            `Updating SNS subscription for flow ${context.flow.id} from ${previousAwsRegion} to ${awsRegion} and ${previousTopicArn} to ${topicArn}.`
          );
          const command = new UnsubscribeCommand({
            SubscriptionArn: util.types.toString(existingSubscriptionArn),
          });
          await sns.send(command);
          context.logger.info(
            `Deleted SNS subscription for flow ${context.flow.id}.`
          );
        } else {
          context.logger.info(
            `SNS subscription already exists for flow ${context.flow.id}. Skipping creation.`
          );
          return;
        }
      }

      context.logger.info(
        `Creating SNS subscription for flow ${context.flow.id} in region ${awsRegion} and topic ${topicArn}.`
      );
      const command = new SubscribeCommand({
        TopicArn: topicArn,
        Protocol: "https",
        Endpoint: context.webhookUrls[context.flow.name],
        Attributes: {
          RawMessageDelivery: "false",
        },
        ReturnSubscriptionArn: true,
      });

      const response = await sns.send(command);
      context.logger.info(
        `Created SNS subscription for topic ${topicArn}. ` +
          `SubscriptionArn: ${response.SubscriptionArn} (pending confirmation)`
      );

      return {
        crossFlowState: {
          [STATE_KEY]: {
            subscriptionArn: response.SubscriptionArn,
            previousAwsRegion: awsRegion,
            previousTopicArn: topicArn,
          },
        },
      };
    },
    delete: async (context, { awsConnection, awsRegion }) => {
      const triggerId = context.webhookUrls[context.flow.name].split("/").pop();
      const STATE_KEY = `${triggerId}:awsSnsTopicSubscription`;
      const { existingSubscriptionArn } = getPreviousTriggerState(
        context,
        STATE_KEY
      );
      if (!existingSubscriptionArn) {
        context.logger.warn(
          `No subscription ARN found for flow ${context.flow.name}. Skipping deletion.`
        );
        return;
      }

      const sns = await createSNSClient({
        awsConnection,
        awsRegion,
        debug: context.debug.enabled,
        logger: context.logger,
      });
      const command = new UnsubscribeCommand({
        SubscriptionArn: existingSubscriptionArn,
      });

      await sns.send(command);
      context.logger.info(
        `Deleted SNS subscription for topic ${topicArn}. ` +
          `SubscriptionArn: ${existingSubscriptionArn}`
      );

      context[STORE_KEY] = {
        [STATE_KEY]: undefined,
      };
    },
  },
});

export default { subscriptionTrigger, webhookLifecycleTrigger };
