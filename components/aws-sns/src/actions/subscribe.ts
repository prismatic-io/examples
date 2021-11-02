import { action, util } from "@prismatic-io/spectral";
import { SNS } from "aws-sdk";
import { authorization, createSNSClient } from "../auth";
import { awsRegion, topicArn, protocol, endpoint } from "../inputs";

interface Response {
  data: SNS.Types.SubscribeResponse;
}
const examplePayload: Response = {
  data: { SubscriptionArn: "Example SubscriptionArn" },
};

export const subscribe = action({
  display: {
    label: "Subscribe to Topic",
    description: "Subscribe to an Amazon SNS Topic",
  },
  perform: async ({ credential }, params) => {
    const sns = await createSNSClient(
      credential,
      util.types.toString(params.awsRegion)
    );
    return {
      data: await sns
        .subscribe({
          Protocol: util.types.toString(params.protocol),
          TopicArn: util.types.toString(params.topicArn),
          Endpoint: util.types.toString(params.endpoint),
        })
        .promise(),
    };
  },
  inputs: { awsRegion, topicArn, protocol, endpoint },
  examplePayload,
  authorization,
});

export default subscribe;
