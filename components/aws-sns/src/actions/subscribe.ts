import { action, util } from "@prismatic-io/spectral";
import { SubscribeCommand } from "@aws-sdk/client-sns";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { topicArn, protocol, endpoint, connectionInput } from "../inputs";
import { subscribeExamplePayload } from "../examplePayloads";

export const subscribe = action({
  display: {
    label: "Subscribe to Topic",
    description: "Subscribe to an Amazon SNS Topic",
  },
  perform: async (
    { logger, debug: { enabled: debug } },
    { awsConnection, awsRegion, topicArn, protocol, endpoint }
  ) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
      debug,
      logger,
    });
    const subscribeParams = {
      Protocol: util.types.toString(protocol),
      TopicArn: topicArn,
      Endpoint: util.types.toString(endpoint),
    };
    const command = new SubscribeCommand(subscribeParams);
    const response = await sns.send(command);
    return {
      data: response,
    };
  },
  inputs: {
    awsRegion,
    topicArn,
    protocol,
    endpoint,
    awsConnection: connectionInput,
  },
  examplePayload: subscribeExamplePayload,
});

export default subscribe;
