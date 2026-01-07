import { pollingTrigger, trigger } from "@prismatic-io/spectral";
import { createClient } from "@prismatic-io/spectral/dist/clients/http";
import { accessKeyInput, bucket } from "./inputs";
import { awsRegion, dynamicAccessAllInputs } from "aws-utils";
import { createS3Client } from "./auth";
import { ListBucketsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { objectMapper } from "./utils";

export const snsS3NotificationWebhook = trigger({
  display: {
    label: "Webhook",
    description: "Trigger to handle SNS subscription for S3 event notifications",
  },
  allowsBranching: true,
  staticBranchNames: ["Notification", "Subscribe"],
  perform: async (context, payload) => {
    const bodyData = payload.body.data as string;
    if (bodyData.length) {
      const data = JSON.parse(bodyData);
      const eventType = data.Type;

      if (eventType) {
        switch (eventType) {
          case "SubscriptionConfirmation": {
            const subscribeUrl = data.SubscribeURL;
            await createClient({
              baseUrl: subscribeUrl,
            }).get("");
            return {
              branch: "Subscribe",
              payload: { ...payload, body: { data } },
            };
          }
          case "Notification": {
            return {
              branch: "Notification",
              payload: { ...payload, body: { data } },
            };
          }

          default:
            throw new Error(
              `Message type was not "Notification" or "SubscriptionConfirmation", but "${eventType}" instead.`,
            );
        }
      }
      throw new Error("Event type not received");
    }
    throw new Error("Missing data in payload");
  },
  inputs: {},
  synchronousResponseSupport: "invalid",
  scheduleSupport: "invalid",
});

export const pollChangesFilesTrigger = pollingTrigger({
  display: {
    label: "New and Updated Files",
    description:
      "Checks for new and updated files in a specified S3 bucket on a configured schedule.",
  },
  inputs: {
    bucket,
    accessKey: accessKeyInput,
    awsRegion,
    ...dynamicAccessAllInputs,
  },
  perform: async (
    context,
    payload,
    {
      accessKey,
      awsRegion,
      bucket,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    },
  ) => {
    const now = new Date().toISOString();
    const pollState = context.polling.getState() as { lastPolledAt: string };
    const lastPolledAt: string = pollState.lastPolledAt || now;

    context.logger.debug(`Polled for changes from: ${lastPolledAt} to ${now}`);
    if (context.debug.enabled) {
      context.logger.debug(`Polling state: ${JSON.stringify(pollState)}`);
    }

    const s3 = await createS3Client({
      awsConnection: accessKey,
      awsRegion,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
      logger: context.logger,
      debug: context.debug.enabled,
    });

    const command = new ListObjectsV2Command({
      Bucket: bucket,
      MaxKeys: 4000,
    });

    const response = await s3.send(command);
    const objects = response.Contents || [];
    const changes = objects
      .map((object) => objectMapper(object, "LastModified"))
      .filter(({ LastModified }) => LastModified > lastPolledAt)
      .map(({ Key }) => Key);

    context.polling.setState({ lastPolledAt: now });

    return {
      payload: { ...payload, body: { data: changes } },
      polledNoChanges: changes?.length === 0,
    };
  },
});

export const pollNewBucketsTrigger = pollingTrigger({
  display: {
    label: "New Buckets",
    description: "Checks for new buckets on a configured schedule.",
  },
  inputs: {
    accessKey: accessKeyInput,
    awsRegion,
    ...dynamicAccessAllInputs,
  },
  perform: async (
    context,
    payload,
    { accessKey, awsRegion, dynamicAccessKeyId, dynamicSecretAccessKey, dynamicSessionToken },
  ) => {
    const now = new Date().toISOString();
    const pollState = context.polling.getState() as { lastPolledAt: string };
    const lastPolledAt: string = pollState.lastPolledAt || now;

    context.logger.debug(`Polled for changes from: ${lastPolledAt} to ${now}`);
    if (context.debug.enabled) {
      context.logger.debug(`Polling state: ${JSON.stringify(pollState)}`);
    }

    const s3 = await createS3Client({
      awsConnection: accessKey,
      awsRegion,
      dynamicAccessKeyId,
      dynamicSecretAccessKey,
      dynamicSessionToken,
    });

    const command = new ListBucketsCommand({});
    const response = await s3.send(command);
    const buckets = response.Buckets || [];

    const changes = buckets
      .map((bucket) => objectMapper(bucket, "CreationDate"))
      .filter(({ CreationDate }) => CreationDate > lastPolledAt);

    context.polling.setState({ lastPolledAt: now });

    return {
      payload: { ...payload, body: { data: changes } },
      polledNoChanges: changes?.length === 0,
    };
  },
});

export default {
  snsS3NotificationWebhook,
  pollChangesFilesTrigger,
  pollNewBucketsTrigger,
};
