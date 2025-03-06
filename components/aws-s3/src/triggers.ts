import { trigger } from "@prismatic-io/spectral";
import { createClient } from "@prismatic-io/spectral/dist/clients/http";

export const snsS3NotificationWebhook = trigger({
  display: {
    label: "Webhook",
    description:
      "Trigger to handle SNS subscription for S3 event notifications",
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
      } else throw new Error("Event type not received");
    } else throw new Error("Missing data in payload");
  },
  inputs: {},
  synchronousResponseSupport: "invalid",
  scheduleSupport: "invalid",
});

export default { snsS3NotificationWebhook };
