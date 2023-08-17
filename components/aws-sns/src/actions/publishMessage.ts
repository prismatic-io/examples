import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import {
  awsRegion,
  message,
  topicArn,
  messageAttributes,
  connectionInput,
} from "../inputs";
import {
  PublishCommand,
  MessageAttributeValue,
  PublishResponse,
} from "@aws-sdk/client-sns";
import { KeyValuePair } from "@prismatic-io/spectral";
interface Response {
  data: PublishResponse;
}

const examplePayload: Response = {
  data: {
    MessageId: "00000000-00000000-00000000-00000000",
  },
};

const getAttributeType = (input: unknown): MessageAttributeValue => {
  if (util.types.isNumber(input)) {
    return {
      DataType: "Number",
      StringValue: util.types.toString(input),
    };
  }
  if (Array.isArray(input)) {
    return {
      DataType: "String.Array",
      StringValue: JSON.stringify(input),
    };
  }
  if (typeof input === "string") {
    return {
      DataType: "String",
      StringValue: input,
    };
  }
  if (Buffer.isBuffer(input)) {
    return {
      DataType: "Binary",
      BinaryValue: input,
    };
  }

  return {
    DataType: "String",
    StringValue: JSON.stringify(input),
  };
};

const attributeReducer = (kvpList: KeyValuePair<unknown>[] = []) => {
  return kvpList.reduce(
    (result, { key, value }) => ({ ...result, [key]: getAttributeType(value) }),
    {}
  );
};

export const publishMessage = action({
  display: {
    label: "Publish Message",
    description: "Publish a message to an Amazon SNS Topic",
  },
  perform: async (context, params) => {
    const sns = createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });
    const publishParams = {
      Message: util.types.toString(params.message),
      MessageAttributes: attributeReducer(params.messageAttributes),
      TopicArn: util.types.toString(params.topicArn),
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
  examplePayload,
});

export default publishMessage;
