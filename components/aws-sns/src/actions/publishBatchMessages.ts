import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { topicArn, connectionInput, publishBatchEntries } from "../inputs";
import {
  PublishBatchCommand,
  type PublishBatchRequestEntry,
} from "@aws-sdk/client-sns";
import { publishBatchMessagesExamplePayload } from "../examplePayloads";

const processBinaryValueIfPresent = (
  parsedEntries
): PublishBatchRequestEntry[] =>
  parsedEntries.map((entry) => {
    if (entry.MessageAttributes) {
      for (const key in entry.MessageAttributes) {
        const messageAttributeValueIsBuffer =
          entry.MessageAttributes[key].BinaryValue &&
          util.types.isBufferDataPayload(
            entry.MessageAttributes[key].BinaryValue
          );
        if (messageAttributeValueIsBuffer) {
          entry.MessageAttributes[key].BinaryValue = Buffer.from(
            entry.MessageAttributes[key].BinaryValue.data
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
  perform: async (
    { logger, debug: { enabled: debug } },
    { awsConnection, awsRegion, topicArn, publishBatchEntries }
  ) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
      debug,
      logger,
    });
    let parsedEntries = JSON.parse(publishBatchEntries);
    if (!Array.isArray(parsedEntries)) {
      throw new Error("Invalid Message Entries");
    }
    parsedEntries = processBinaryValueIfPresent(parsedEntries);
    const batchCommand = new PublishBatchCommand({
      TopicArn: topicArn,
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
  examplePayload: publishBatchMessagesExamplePayload,
});

export default publishBatchMessages;
