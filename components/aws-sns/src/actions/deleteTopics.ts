import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion, topicArn, connectionInput } from "../inputs";

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

    return {
      data: await sns
        .deleteTopic({ TopicArn: util.types.toString(params.topicArn) })
        .promise(),
    };
  },
  inputs: { awsRegion, topicArn, awsConnection: connectionInput },
});

export default deleteTopic;
