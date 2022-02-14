import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion, message, phoneNumber, connectionInput } from "../inputs";
import { SNS } from "aws-sdk";

interface Response {
  data: SNS.Types.PublishResponse;
}

const examplePayload: Response = {
  data: {
    MessageId: "Example Message Id",
  },
};

export const publishSms = action({
  display: {
    label: "Publish SMS",
    description: "Publish an SMS message to an Amazon SNS Topic",
  },
  perform: async (context, params) => {
    const sns = await createSNSClient({
      awsConnection: params.awsConnection,
      awsRegion: util.types.toString(params.awsRegion),
    });
    return {
      data: await sns
        .publish({
          Message: util.types.toString(params.message),
          PhoneNumber: util.types.toString(params.phoneNumber),
        })
        .promise(),
    };
  },
  inputs: { awsRegion, message, phoneNumber, awsConnection: connectionInput },
  examplePayload,
});

export default publishSms;
