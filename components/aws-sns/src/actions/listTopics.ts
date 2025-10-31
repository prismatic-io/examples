import { action } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { nextToken, connectionInput, fetchAllTopics } from "../inputs";
import type { ListTopicsResponse } from "@aws-sdk/client-sns";
import { fetchTopics } from "../utils";
interface Response {
  data: ListTopicsResponse;
}

const examplePayload: Response = {
  data: {
    Topics: [{ TopicArn: "arn:aws:Example Topic Arn" }],
  },
};

export const listTopics = action({
  display: {
    label: "List Topics",
    description: "List available Amazon SNS Topics",
  },
  perform: async (context, { awsConnection, awsRegion, nextToken, fetchAllTopics }) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
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
  examplePayload,
});

export default listTopics;
