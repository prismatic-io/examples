import { GetCallerIdentityCommand, STSClient } from "@aws-sdk/client-sts";
import { action } from "@prismatic-io/spectral";
import { dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import { getCurrentAccountPayload } from "../examplePayloads";
import { accessKeyInput } from "../inputs";
export const getCurrentAccount = action({
  display: {
    label: "Get Current Account",
    description: "Get the current AWS account",
  },
  perform: async (
    context,
    { accessKey, dynamicAccessKeyId, dynamicSecretAccessKey, dynamicSessionToken },
  ) => {
    const s3 = await createS3Client({
      awsConnection: accessKey,
      awsRegion: "",
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
      logger: context.logger,
      debug: context.debug.enabled,
    });
    const sts = new STSClient({ credentials: s3.config.credentials });
    const command = new GetCallerIdentityCommand({});
    const response = await sts.send(command);
    return { data: response };
  },
  inputs: { accessKey: accessKeyInput, ...dynamicAccessAllInputs },
  examplePayload: getCurrentAccountPayload,
});
