import { action, util } from "@prismatic-io/spectral";
import { createSNSClient } from "../client";
import { awsRegion } from "aws-utils";
import { message, phoneNumber, connectionInput } from "../inputs";
import { PublishCommand } from "@aws-sdk/client-sns";
import { publishSmsExamplePayload } from "../examplePayloads";

export const publishSms = action({
  display: {
    label: "Publish SMS",
    description: "Publish an SMS message to an Amazon SNS Topic",
  },
  perform: async (
    { logger, debug: { enabled: debug } },
    { awsConnection, awsRegion, message, phoneNumber }
  ) => {
    const sns = await createSNSClient({
      awsConnection,
      awsRegion,
      debug,
      logger,
    });
    const publishParams = {
      Message: util.types.toString(message),
      PhoneNumber: util.types.toString(phoneNumber),
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
    phoneNumber,
    awsConnection: connectionInput,
  },
  examplePayload: publishSmsExamplePayload,
});

export default publishSms;
