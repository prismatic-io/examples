import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { name, connectionInput } from "../inputs";
import { awsRegion } from "aws-utils";
import { CreateTopicCommand } from "@aws-sdk/client-sns";
import { createTopicExamplePayload } from "../examplePayloads";

export const createTopic = action({
  display: {
    label: "Create Topic",
    description: "Create an Amazon SNS Topic",
  },
  perform: async (
    { logger, debug: { enabled: debug } },
    { awsConnection, awsRegion, name }
  ) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
      debug,
      logger,
    });
    const createTopicParams = { Name: util.types.toString(name) };
    const command = new CreateTopicCommand(createTopicParams);
    const response = await sns.send(command);

    return {
      data: response,
    };
  },
  inputs: { awsRegion, name, awsConnection: connectionInput },
  examplePayload: createTopicExamplePayload,
});

export default createTopic;
