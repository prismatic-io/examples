import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { topicArn, connectionInput } from "../inputs";
import { DeleteTopicCommand } from "@aws-sdk/client-sns";

export const deleteTopic = action({
  display: {
    label: "Delete Topic",
    description: "Delete an Amazon SNS Topic",
  },
  perform: async (context, params) => {
    const sns = await createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });
    const deleteTopicParams = {
      TopicArn: util.types.toString(params.topicArn),
    };
    const command = new DeleteTopicCommand(deleteTopicParams);
    const response = await sns.send(command);

    return {
      data: response,
    };
  },
  inputs: { awsRegion, topicArn, awsConnection: connectionInput },
});

export default deleteTopic;
