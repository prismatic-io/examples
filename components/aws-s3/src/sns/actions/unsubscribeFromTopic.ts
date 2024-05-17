import { action } from "@prismatic-io/spectral";
import { createSNSClient } from "../../auth";
import { subscriptionArn, accessKeyInput } from "../../inputs";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { UnsubscribeCommand } from "@aws-sdk/client-sns";
import { unsubscribeFromTopicPayload } from "../../examplePayloads";

export const unsubscribeFromTopic = action({
  display: {
    label: "Unsubscribe from a SNS Topic",
    description:
      "Unsubscribe from an Amazon SNS Topic for S3 Event Notifications",
  },
  perform: async (
    context,
    {
      awsConnection,
      awsRegion,
      subscriptionArn,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    }
  ) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    });
    const unsubscribeParams = {
      SubscriptionArn: subscriptionArn,
    };
    const command = new UnsubscribeCommand(unsubscribeParams);
    const response = await sns.send(command);
    return {
      data: response,
    };
  },
  inputs: {
    awsRegion,
    subscriptionArn,
    awsConnection: accessKeyInput,
    ...dynamicAccessAllInputs,
  },
  examplePayload: unsubscribeFromTopicPayload,
});
