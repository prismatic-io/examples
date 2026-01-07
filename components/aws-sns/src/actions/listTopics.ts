import { action } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { nextToken, connectionInput, fetchAllTopics } from "../inputs";
import { fetchTopics } from "../utils";
import { listTopicsExamplePayload } from "../examplePayloads";

export const listTopics = action({
  display: {
    label: "List Topics",
    description: "List available Amazon SNS Topics",
  },
  perform: async (
    { logger, debug: { enabled: debug } },
    { awsConnection, awsRegion, nextToken, fetchAllTopics }
  ) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
      debug,
      logger,
    });
    const response = await fetchTopics(sns, fetchAllTopics, nextToken);

    return {
      data: response,
    };
  },
  inputs: {
    awsConnection: connectionInput,
    awsRegion,
    fetchAllTopics,
    nextToken,
  },
  examplePayload: listTopicsExamplePayload,
});

export default listTopics;
