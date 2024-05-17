import { action } from "@prismatic-io/spectral";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "../auth";
import {
  accessKeyInput,
  bucket,
  defaultRetentionDays,
  defaultRetentionMode,
  defaultRetentionYears,
} from "../inputs";
import {
  ObjectLockConfiguration,
  PutObjectLockConfigurationCommand,
} from "@aws-sdk/client-s3";
import { putObjectLockConfigurationPayload } from "../examplePayloads";

export const putObjectLockConfiguration = action({
  display: {
    label: "Put Object Lock Configuration",
    description: "Places an Object Lock configuration on the specified bucket",
  },
  perform: async (
    context,
    {
      awsRegion,
      accessKey,
      bucket,
      defaultRetentionDays,
      defaultRetentionMode,
      defaultRetentionYears,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    }
  ) => {
    const s3 = await createS3Client({
      awsConnection: accessKey,
      awsRegion,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    });
    const defaultRetentionDaysPresent = defaultRetentionDays > 0;
    const defaultRetentionYearsPresent = defaultRetentionYears > 0;
    const defaultRetentionModePresent = defaultRetentionMode.length > 0;

    if (defaultRetentionDaysPresent && defaultRetentionYearsPresent) {
      throw new Error(
        "You cannot specify both Default Retention Years and Default Retention Days. Please specify one or the other."
      );
    }

    if (
      defaultRetentionModePresent &&
      !defaultRetentionDaysPresent &&
      !defaultRetentionYearsPresent
    ) {
      throw new Error(
        "You must specify either Default Retention Years or Default Retention Days."
      );
    }

    if (
      !defaultRetentionModePresent &&
      (defaultRetentionDaysPresent || defaultRetentionYearsPresent)
    )
      throw new Error("You must specify a Default Retention Mode.");

    const objectLockConfiguration: ObjectLockConfiguration = {
      ObjectLockEnabled: "Enabled",
      Rule: defaultRetentionModePresent
        ? {
            DefaultRetention: {
              Days: defaultRetentionDaysPresent
                ? defaultRetentionDays
                : undefined,
              Mode: defaultRetentionMode,
              Years: defaultRetentionYearsPresent
                ? defaultRetentionYears
                : undefined,
            },
          }
        : undefined,
    };

    const command = new PutObjectLockConfigurationCommand({
      ObjectLockConfiguration: objectLockConfiguration,
      Bucket: bucket,
    });
    const data = await s3.send(command);

    return {
      data,
    };
  },
  inputs: {
    awsRegion,
    accessKey: accessKeyInput,
    ...dynamicAccessAllInputs,
    bucket,
    defaultRetentionMode,
    defaultRetentionDays,
    defaultRetentionYears,
  },
  examplePayload: putObjectLockConfigurationPayload,
});
