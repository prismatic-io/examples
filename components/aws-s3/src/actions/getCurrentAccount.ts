import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { getCurrentAccountPayload } from "../examplePayloads";
import { action } from "@prismatic-io/spectral";
import { createS3Client } from "../auth";
import { accessKeyInput } from "../inputs";
import { dynamicAccessAllInputs } from "aws-utils";
export const getCurrentAccount = action({
  display: {
    label: "Get Current Account",
    description: "Get the current AWS account",
  },
  perform: async (
    context,
    {
      accessKey,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    }
  ) => {
    const s3 = await createS3Client({
      awsConnection: accessKey,
      awsRegion: "",
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    });
    const sts = new STSClient({ credentials: s3.config.credentials });
    const command = new GetCallerIdentityCommand({});
    const response = await sts.send(command);
    return { data: response };
  },
  inputs: { accessKey: accessKeyInput, ...dynamicAccessAllInputs },
  examplePayload: getCurrentAccountPayload,
});
