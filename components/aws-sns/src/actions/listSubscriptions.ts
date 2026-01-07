import { action } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import {
  topicArn,
  nextToken,
  connectionInput,
  fetchAllSubscriptions,
} from "../inputs";
import { fetchSubscriptions } from "../utils";
import { listSubscriptionsExamplePayload } from "../examplePayloads";

export const listSubscriptions = action({
  display: {
    label: "List Subscriptions",
    description: "Retrieve the subscriptions of an Amazon SNS Topic",
  },
  perform: async (
    { logger, debug: { enabled: debug } },
    { awsConnection, awsRegion, topicArn, nextToken, fetchAllSubscriptions }
  ) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
      debug,
      logger,
    });
    const response = await fetchSubscriptions(
      sns,
      topicArn,
      fetchAllSubscriptions,
      nextToken
    );

    return {
      data: response,
    };
  },
  inputs: {
    awsConnection: connectionInput,
    awsRegion,
    topicArn,
    fetchAllSubscriptions,
    nextToken,
  },
  examplePayload: listSubscriptionsExamplePayload,
});

export default listSubscriptions;
