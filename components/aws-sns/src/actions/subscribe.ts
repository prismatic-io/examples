import { action, util } from "@prismatic-io/spectral";
import { SubscribeCommand, SubscribeResponse } from "@aws-sdk/client-sns";
import { createSNSClient } from "../client";
import {
  awsRegion,
  topicArn,
  protocol,
  endpoint,
  connectionInput,
} from "../inputs";

interface Response {
  data: SubscribeResponse;
}
const examplePayload: Response = {
  data: {
    SubscriptionArn:
      "arn:aws:sns:us-east-2:123456789012:MyExampleTopic:00000000-00000000-00000000-00000000",
  },
};

export const subscribe = action({
  display: {
    label: "Subscribe to Topic",
    description: "Subscribe to an Amazon SNS Topic",
  },
  perform: async (context, params) => {
    const sns = createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });
    const subscribeParams = {
      Protocol: util.types.toString(params.protocol),
      TopicArn: util.types.toString(params.topicArn),
      Endpoint: util.types.toString(params.endpoint),
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
  examplePayload,
});

export default subscribe;
