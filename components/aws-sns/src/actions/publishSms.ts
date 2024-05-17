import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { message, phoneNumber, connectionInput } from "../inputs";
import { PublishCommand, PublishResponse } from "@aws-sdk/client-sns";

interface Response {
  data: PublishResponse;
}

const examplePayload: Response = {
  data: {
    MessageId: "00000000-00000000-00000000-00000000",
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
    const publishParams = {
      Message: util.types.toString(params.message),
      PhoneNumber: util.types.toString(params.phoneNumber),
    };
    const command = new PublishCommand(publishParams);
    const response = await sns.send(command);
    return {
      data: response,
    };
  },
  inputs: { awsRegion, message, phoneNumber, awsConnection: connectionInput },
  examplePayload,
});

export default publishSms;
