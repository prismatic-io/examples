import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion, nextToken, connectionInput } from "../inputs";
import { ListTopicsCommand, ListTopicsResponse } from "@aws-sdk/client-sns";
interface Response {
  data: ListTopicsResponse;
}

const examplePayload: Response = {
  data: {
    Topics: [{ TopicArn: "arn:aws:Example Topic Arn" }],
  },
};

export const listTopics = action({
  display: {
    label: "List Topics",
    description: "List available Amazon SNS Topics",
  },
  perform: async (context, params) => {
    const sns = createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });
    const listTopicParams = {
      NextToken: util.types.toString(params.nextToken) || undefined,
    };
    const command = new ListTopicsCommand(listTopicParams);
    const response = await sns.send(command);

    return {
      data: response,
    };
  },
  inputs: { awsRegion, nextToken, awsConnection: connectionInput },
  examplePayload,
});

export default listTopics;
