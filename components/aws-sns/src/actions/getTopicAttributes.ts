import { action } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { topicArn, connectionInput } from "../inputs";
import { GetTopicAttributesCommand } from "@aws-sdk/client-sns";
import { getTopicAttributesExamplePayload } from "../examplePayloads";

export const getTopicAttributes = action({
  display: {
    label: "Get Topic Attributes",
    description: "Retrieves the attributes of an Amazon SNS Topic.",
  },
  perform: async (
    { logger, debug: { enabled: debug } },
    { awsConnection, awsRegion, topicArn }
  ) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
      debug,
      logger,
    });
    const getTopicAttributesParams = {
      TopicArn: topicArn,
    };
    const command = new GetTopicAttributesCommand(getTopicAttributesParams);
    const response = await sns.send(command);

    return {
      data: response,
    };
  },
  inputs: { awsRegion, topicArn, awsConnection: connectionInput },
  examplePayload: getTopicAttributesExamplePayload,
});

export default getTopicAttributes;
