import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion, name, accessKeyInput } from "../../inputs";
import {
  CreateTopicResponse,
  CreateTopicCommand,
  CreateTopicCommandInput,
} from "@aws-sdk/client-sns";

interface Response {
  data: CreateTopicResponse;
}

const examplePayload: Response = {
  data: {
    TopicArn: "arn:aws:Example Topic Arn",
  },
};

export const createTopic = action({
  display: {
    label: "Create SNS Topic For S3 Event Notification",
    description:
      "Create an Amazon SNS Topic to be used with S3 Event Notifications",
  },
  perform: async (context, { awsConnection, awsRegion, name }) => {
    const sns = createSNSClient({
      awsConnection,
      awsRegion,
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
  },
  examplePayload,
});

export default createTopic;
