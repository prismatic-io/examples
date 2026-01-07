import { SubscribeCommand, type SubscribeCommandInput } from "@aws-sdk/client-sns";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createSNSClient } from "../../auth";
import { subscribeToTopicPayload } from "../../examplePayloads";
import { accessKeyInput, endpoint, snsTopicArn } from "../../inputs";

export const subscribeToTopic = action({
  display: {
    label: "Subscribe to SNS Topic",
    description: "Subscribe to an Amazon SNS Topic for S3 Event Notifications",
  },
  perform: async (
    context,
    {
      awsRegion,
      awsConnection,
      snsTopicArn,
      endpoint,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    },
  ) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
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
    ...dynamicAccessAllInputs,
  },
  examplePayload: subscribeToTopicPayload,
});
