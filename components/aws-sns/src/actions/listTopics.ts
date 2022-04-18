import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion, nextToken, connectionInput } from "../inputs";
import { SNS } from "aws-sdk";
interface Response {
  data: SNS.Types.ListTopicsResponse;
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
    const sns = await createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });

    return {
      data: await sns
        .listTopics({
          NextToken: util.types.toString(params.nextToken) || undefined,
        })
        .promise(),
    };
  },
  inputs: { awsRegion, nextToken, awsConnection: connectionInput },
  examplePayload,
});

export default listTopics;
