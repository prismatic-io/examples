import { action, util } from "@prismatic-io/spectral";
import { authorization, createSNSClient } from "../auth";
import { awsRegion } from "../inputs";
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
  perform: async ({ credential }, params) => {
    const sns = await createSNSClient(
      credential,
      util.types.toString(params.awsRegion)
    );

    return {
      data: await sns.listTopics({}).promise(),
    };
  },
  inputs: { awsRegion },
  examplePayload,
  authorization,
});

export default listTopics;
