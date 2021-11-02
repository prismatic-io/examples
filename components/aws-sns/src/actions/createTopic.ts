import { action, util } from "@prismatic-io/spectral";
import { authorization, createSNSClient } from "../auth";
import { awsRegion, name } from "../inputs";
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
  perform: async ({ credential }, params) => {
    const sns = await createSNSClient(
      credential,
      util.types.toString(params.awsRegion)
    );

    return {
      data: await sns
        .createTopic({ Name: util.types.toString(params.name) })
        .promise(),
    };
  },
  inputs: { awsRegion, name },
  examplePayload,
  authorization,
});

export default createTopic;
