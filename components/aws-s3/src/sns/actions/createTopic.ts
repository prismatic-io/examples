import { CreateTopicCommand, type CreateTopicCommandInput } from "@aws-sdk/client-sns";
import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createSNSClient } from "../../auth";
import { createTopicPayload } from "../../examplePayloads";
import { accessKeyInput, name } from "../../inputs";

export const createTopic = action({
  display: {
    label: "Create SNS Topic For S3 Event Notification",
    description: "Create an Amazon SNS Topic to be used with S3 Event Notifications",
  },
  perform: async (
    context,
    {
      awsConnection,
      awsRegion,
      name,
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

    const createTopicParams: CreateTopicCommandInput = {
      Name: name,
      Attributes: { FifoTopic: "false" },
    };
    const command = new CreateTopicCommand(createTopicParams);
    const response = await sns.send(command);

    return {
      data: response,
    };
  },
  inputs: {
    awsRegion,
    name,
    awsConnection: accessKeyInput,
    ...dynamicAccessAllInputs,
  },
  examplePayload: createTopicPayload,
});
