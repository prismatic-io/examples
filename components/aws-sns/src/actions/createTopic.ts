import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion, name, connectionInput } from "../inputs";
import { CreateTopicResponse, CreateTopicCommand } from "@aws-sdk/client-sns";

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
    label: "Create Topic",
    description: "Create an Amazon SNS Topic",
  },
  perform: async (context, params) => {
    const sns = createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });
    const createTopicParams = { Name: util.types.toString(params.name) };
    const command = new CreateTopicCommand(createTopicParams);
    const response = await sns.send(command);

    return {
      data: response,
    };
  },
  inputs: { awsRegion, name, awsConnection: connectionInput },
  examplePayload,
});

export default createTopic;
