import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { topicArn, connectionInput, publishBatchEntries } from "../inputs";
import {
  PublishBatchCommandOutput,
  PublishBatchCommand,
  PublishBatchRequestEntry,
} from "@aws-sdk/client-sns";
interface Response {
  data: PublishBatchCommandOutput;
}

const examplePayload: Response = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "3df5ab1c-8e8a-426f-a2d1-bd7a39ef8651",
      attempts: 1,
      totalRetryDelay: 0,
    },
    Successful: [
      {
        Id: "2",
        MessageId: "6d1a92c3-77bc-49a5-bf62-1f047c34f9e7",
      },
    ],
    Failed: [],
  },
};

const processBinaryValueIfPresent = (
  parsedEntries,
): PublishBatchRequestEntry[] =>
  parsedEntries.map((entry) => {
    if (entry.MessageAttributes) {
      for (const key in entry.MessageAttributes) {
        const messageAttributeValueIsBuffer =
          entry.MessageAttributes[key].BinaryValue &&
          util.types.isBufferDataPayload(
            entry.MessageAttributes[key].BinaryValue,
          );
        if (messageAttributeValueIsBuffer) {
          entry.MessageAttributes[key].BinaryValue = Buffer.from(
            entry.MessageAttributes[key].BinaryValue.data,
          );
        }
      }
    }
    return entry;
  });

export const publishBatchMessages = action({
  display: {
    label: "Publish Batch Messages",
    description:
      "Publishes up to ten messages to the specified Amazon SNS Topic",
  },
  perform: async (context, params) => {
    const sns = await createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });
    let parsedEntries = JSON.parse(params.publishBatchEntries);
    if (!Array.isArray(parsedEntries)) {
      throw new Error("Invalid Message Entries");
    }
    parsedEntries = processBinaryValueIfPresent(parsedEntries);
    const batchCommand = new PublishBatchCommand({
      TopicArn: util.types.toString(params.topicArn),
      PublishBatchRequestEntries: parsedEntries,
    });
    const response = await sns.send(batchCommand);
    return {
      data: response,
    };
  },
  inputs: {
    awsRegion,
    topicArn,
    publishBatchEntries,
    awsConnection: connectionInput,
  },
  examplePayload,
});

export default publishBatchMessages;
