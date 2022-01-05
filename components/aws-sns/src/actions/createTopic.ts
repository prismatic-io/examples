import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion, name, connectionInput } from "../inputs";
import { SNS } from "aws-sdk";

interface Response {
  data: SNS.Types.CreateTopicResponse;
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
    const sns = await createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });

    return {
      data: await sns
        .createTopic({ Name: util.types.toString(params.name) })
        .promise(),
    };
  },
  inputs: { awsRegion, name, awsConnection: connectionInput },
  examplePayload,
});

export default createTopic;
