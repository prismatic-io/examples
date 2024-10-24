import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { util } from "@prismatic-io/spectral";
import { Credentials } from "../interfaces/Credentials";
export const assumeRole = async (
  region: string,
  accessKeyId: string,
  secretAccessKey: string,
  roleArn: string,
): Promise<Credentials> => {
  const stsClient = new STSClient({
    ...(region.length > 0 && { region }),
    credentials: { accessKeyId, secretAccessKey },
  });
  const {
    Credentials: { AccessKeyId, SecretAccessKey, SessionToken },
  } = await stsClient.send(
    new AssumeRoleCommand({
      RoleArn: util.types.toString(roleArn),
      RoleSessionName: "integration-session",
    }),
  );
  return {
    accessKeyId: AccessKeyId,
    secretAccessKey: SecretAccessKey,
    sessionToken: SessionToken,
  };
};
