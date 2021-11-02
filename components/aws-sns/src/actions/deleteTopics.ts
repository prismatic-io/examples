import { action, util } from "@prismatic-io/spectral";
import { authorization, createSNSClient } from "../auth";
import { awsRegion, topicArn } from "../inputs";

export const deleteTopic = action({
  display: {
    label: "Delete Topic",
    description: "Delete an Amazon SNS Topic",
  },
  perform: async ({ credential }, params) => {
    const sns = await createSNSClient(
      credential,
      util.types.toString(params.awsRegion)
    );

    return {
      data: await sns
        .deleteTopic({ TopicArn: util.types.toString(params.topicArn) })
        .promise(),
    };
  },
  inputs: { awsRegion, topicArn },
  authorization,
});

export default deleteTopic;
