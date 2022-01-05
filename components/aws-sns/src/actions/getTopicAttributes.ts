import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion, topicArn, connectionInput } from "../inputs";
import { SNS } from "aws-sdk";

interface Response {
  data: SNS.Types.GetTopicAttributesResponse;
}

const examplePayload: Response = {
  data: {
    Attributes: {
      Policy: "Example Policy",
      Owner: "Example Owner",
      topicArn: "arn:aws:Example Topic Arn",
      SubscriptionsPending: "0",
      EffectiveDeliveryPolicy: "Example Delivery Policy",
      SubscriptionsConfirmed: "1",
      DisplayName: "Example Display Name",
      SubscriptionsDeleted: "5",
    },
  },
};

export const getTopicAttributes = action({
  display: {
    label: "Get Topic Attributes",
    description: "Retrieves the attributes of an Amazon SNS Topic.",
  },
  perform: async (context, params) => {
    const sns = await createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });

    return {
      data: await sns
        .getTopicAttributes({ TopicArn: util.types.toString(params.topicArn) })
        .promise(),
    };
  },
  inputs: { awsRegion, topicArn, awsConnection: connectionInput },
  examplePayload,
});

export default getTopicAttributes;
