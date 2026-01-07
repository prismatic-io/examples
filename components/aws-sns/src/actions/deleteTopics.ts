import { action } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { topicArn, connectionInput } from "../inputs";
import { DeleteTopicCommand } from "@aws-sdk/client-sns";
import { deleteTopicExamplePayload } from "../examplePayloads";

export const deleteTopic = action({
  display: {
    label: "Delete Topic",
    description: "Delete an Amazon SNS Topic",
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
    const deleteTopicParams = {
      TopicArn: topicArn,
    };
    const command = new DeleteTopicCommand(deleteTopicParams);
    const response = await sns.send(command);

    return {
      data: response,
    };
  },
  inputs: { awsRegion, topicArn, awsConnection: connectionInput },
  examplePayload: deleteTopicExamplePayload,
});

export default deleteTopic;
