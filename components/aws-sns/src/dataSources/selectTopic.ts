import { dataSource, type Element } from "@prismatic-io/spectral";
import { awsRegion } from "aws-utils";
import { connectionInput } from "../inputs";
import { createSNSClient } from "../client";
import { fetchTopics } from "../utils";


export const selectTopic = dataSource({
  display: {
    label: "Select Topic",
    description: "Select a topic from the list of topics",
  },
  inputs: {
    awsConnection: connectionInput,
    awsRegion: { ...awsRegion, dataSource: undefined, model: undefined }, // TODO: Model removed until inline data sources support complex inputs

  },
  perform: async (context, { awsConnection, awsRegion }) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
    });

    const { Topics: topics } = await fetchTopics(sns, true, undefined);

    const result = topics
      ? topics.map<Element>((topic) => ({
        label: `Topic: ${topic.TopicArn.split(':').pop()}`,
        key: topic.TopicArn,
      }))
      : [];
    return { result };
  },
  dataSourceType: "picklist",
});
