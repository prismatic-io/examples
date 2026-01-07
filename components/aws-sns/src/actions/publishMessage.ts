import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import {
  message,
  topicArn,
  messageAttributes,
  connectionInput,
} from "../inputs";
import {
  PublishCommand,
  type MessageAttributeValue,
} from "@aws-sdk/client-sns";
import type { KeyValuePair } from "@prismatic-io/spectral";
import { publishMessageExamplePayload } from "../examplePayloads";

const getAttributeType = (input: unknown): MessageAttributeValue => {
  if (typeof input === "string") {
    if (util.types.isNumber(input)) {
      // Handle numbers
      return {
        DataType: "Number",
        StringValue: input,
      };
    }

    if (util.types.isJSON(input)) {
      try {
        const array = JSON.parse(input);
        if (Array.isArray(array)) {
          // Handle JSON arrays
          return {
            DataType: "String.Array",
            StringValue: JSON.stringify(array),
          };
        }
      } catch (error) {
        // JSON parsing error; continue without doing anything
      }
    }

    // Default to handling as a string
    return {
      DataType: "String",
      StringValue: input,
    };
  }
  // To enter this condition, a Buffer from a previous step was added to the key/value input
  if (Buffer.isBuffer(input)) {
    // Handle binary data
    return {
      DataType: "Binary",
      BinaryValue: input,
    };
  }

  // Default to handling as a string
  return {
    DataType: "String",
    StringValue: JSON.stringify(input),
  };
};

const attributeReducer = (kvpList: KeyValuePair<unknown>[] = []) => {
  return kvpList.reduce(
    (result, { key, value }) =>
      Object.assign(result, { [key]: getAttributeType(value) }),
    {}
  );
};

export const publishMessage = action({
  display: {
    label: "Publish Message",
    description: "Publish a message to an Amazon SNS Topic",
  },
  perform: async (
    { logger, debug: { enabled: debug } },
    { awsConnection, awsRegion, message, topicArn, messageAttributes }
  ) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
      debug,
      logger,
    });
    const publishParams = {
      Message: util.types.toString(message),
      MessageAttributes: attributeReducer(messageAttributes),
      TopicArn: topicArn,
    };
    const command = new PublishCommand(publishParams);
    const response = await sns.send(command);

    return {
      data: response,
    };
  },
  inputs: {
    awsRegion,
    message,
    topicArn,
    messageAttributes,
    awsConnection: connectionInput,
  },
  examplePayload: publishMessageExamplePayload,
});

export default publishMessage;
