import { action } from "@prismatic-io/spectral";
import {
  SubscribeCommand,
  SubscribeResponse,
  SubscribeCommandInput,
} from "@aws-sdk/client-sns";
import { createSNSClient } from "../client";
import { awsRegion, snsTopicArn, endpoint, accessKeyInput } from "../../inputs";

interface Response {
  data: SubscribeResponse;
}
const examplePayload: Response = {
  data: {
    SubscriptionArn:
      "arn:aws:sns:us-east-2:123456789012:MyExampleTopic:00000000-00000000-00000000-00000000",
  },
};

export const subscribeToTopic = action({
  display: {
    label: "Subscribe to SNS Topic",
    description: "Subscribe to an Amazon SNS Topic for S3 Event Notifications",
  },
  perform: async (
    context,
    { awsRegion, awsConnection, snsTopicArn, endpoint }
  ) => {
    const sns = createSNSClient({
      awsConnection,
      awsRegion,
    });
    const subscribeParams: SubscribeCommandInput = {
      Protocol: "https",
      TopicArn: snsTopicArn,
      Endpoint: endpoint,
    };
    const subscribeCommand = new SubscribeCommand(subscribeParams);
    const responseSubscribeCommand = await sns.send(subscribeCommand);

    return {
      data: responseSubscribeCommand,
    };
  },
  inputs: {
    awsRegion,
    snsTopicArn,
    endpoint,
    awsConnection: accessKeyInput,
  },
  examplePayload,
});

export default subscribeToTopic;
