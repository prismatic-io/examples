import { action, util } from "@prismatic-io/spectral";
import { authorization, createSNSClient } from "../auth";
import { awsRegion, message, phoneNumber } from "../inputs";
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
  perform: async ({ credential }, params) => {
    const sns = await createSNSClient(
      credential,
      util.types.toString(params.awsRegion)
    );

    return {
      data: await sns
        .publish({
          Message: util.types.toString(params.message),
          PhoneNumber: util.types.toString(params.phoneNumber),
        })
        .promise(),
    };
  },
  inputs: { awsRegion, message, phoneNumber },
  examplePayload,
  authorization,
});

export default publishSms;
