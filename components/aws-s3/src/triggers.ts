import { trigger } from "@prismatic-io/spectral";
import axios from "axios";

export const snsS3NotificationWebhook = trigger({
  display: {
    label: "Webhook",
    description:
      "Trigger to handle SNS subscription for S3 event notifications",
  },
  allowsBranching: true,
  staticBranchNames: ["Notification", "Subscribe"],
  examplePayload: {
    payload: {
      headers: {
        "Accept-Encoding": "gzip,deflate",
        "Content-Type": "text/plain; charset=UTF-8",
        Host: "hooks.prismatic.io",
        "User-Agent": "Amazon Simple Notification Service Agent",
        "X-Amz-Cf-Id":
          "YniH-T5wsgLIDAZGQqoyBHaDGn7wn-6HLrba6tXoQPeWzF4kKBU12345",
        "x-amz-sns-message-id": "bf30dd82-9ea0-5810-8856-80a8f5b12345",
        "x-amz-sns-message-type": "Notification",
        "x-amz-sns-subscription-arn":
          "arn:aws:sns:us-east-2:360110312345:TopicName:885a69c3-c9e8-4e60-95e0-eef25d212345",
        "x-amz-sns-topic-arn": "arn:aws:sns:us-east-2:360110312345:TopicName",
        "X-Amzn-Trace-Id": "Root=1-64b068d6-637723ca3d4d079c07112345",
      },
      queryParameters: null,
      rawBody: "<data (1790 bytes)>",
      body: {
        data: {
          Type: "Notification",
          MessageId: "bf30dd82-9ea0-5810-8856-80a8f5b12345",
          TopicArn: "arn:aws:sns:us-east-2:360110312345:TopicName",
          Subject: "Amazon S3 Notification",
          Message:
            '{"Records":[{"eventVersion":"2.1","eventSource":"aws:s3","awsRegion":"us-east-2","eventTime":"2023-07-13T21:12:53.055Z","eventName":"ObjectCreated:Put","userIdentity":{"principalId":"AHAMUB6P64E3X"},"requestParameters":{"sourceIPAddress":"189.3.2.1"},"responseElements":{"x-amz-request-id":"F4SB1AW5GXE12345","x-amz-id-2":"ushICMH5Uag/mHKtTGsdxqV3NqMCKvLQyZgw7qNrfKU/FeTaJhKmAO6Z+pG0DITDcmmIcXHB25nmOnxnsVxByqK8qVpFVrcvy+u0Swy12345"},"s3":{"s3SchemaVersion":"1.0","configurationId":"EventName","bucket":{"name":"bucketName","ownerIdentity":{"principalId":"12345"},"arn":"arn:aws:s3:::bucketName"},"object":{"key":"test.docx","size":12551,"eTag":"c8a35e0c8dc9b8a2b622339fa5b12345","sequencer":"0064B068D4E19CDEAD"}}}]}',
          Timestamp: "2023-07-13T21:12:54.505Z",
          SignatureVersion: "1",
          Signature:
            "ZlPxmNxGxhG05drIsJONhJw8bA8kW4XJ3zB5KjIfr7cMJX8iDkcyhI3T8ptn8Klc0InlwCkdmuV3HSWBL/RkwY47za5rFOXuHxuwKwCu4sbTiEfOnznoRnfYaq/hORp3Si4IIVpU2F7CVHfNOseiU1Ml+kktdHzf2rPBsD8iaWh7R9edtv9P0dZ5jrPV4dXDaIaqf5t/4FgCvYCoxcTqgaIfcL6EYtGmxSsTC3fc47OAjpTaj9mEeQ/c23P6pOYGchDwbE/Yl/Slioy9lk93pahRoUzukpbj8z5cJm9iGlT++v6O2ztwO/x12345",
          SigningCertURL:
            "https://sns.us-east-2.amazonaws.com/SimpleNotificationService-12345.pem",
          UnsubscribeURL:
            "https://sns.us-east-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-2:360110312345:TopicName:885a69c3-c9e8-4e60-95e0-eef212345",
        },
      },
      pathFragment: "",
      webhookUrls: {
        "Flow 1": "https://hooks.prismatic.io/trigger/<WEBHOOK_ID>",
      },
      webhookApiKeys: {
        "Flow 1": ["sample-api-key"],
        "SNS S3": ["sample-api-key"],
      },
      invokeUrl: "https://hooks.prismatic.io/trigger/<WEBHOOK_ID>",
      executionId:
        "SW5zdGFuY2VFeGVjdXRpb25SZXN1bHQ6N2Y3NmJkNjctZjFkNS00YTU5LTliODEtN2JiZGJlNGM12345",
      customer: {
        id: "testCustomerId",
        name: "Test Customer",
        externalId: "testCustomerExternalId",
      },
      instance: {
        id: "testInstanceId",
        name: "Test Instance",
      },
      user: {
        id: "testUserId",
        email: "testUserEmail@example.com",
        name: "Test User",
        externalId: "testUserExternalId",
      },
    },
  },
  perform: async (context, payload) => {
    const bodyData = payload.body.data as string;
    if (bodyData.length) {
      const data = JSON.parse(bodyData);
      const eventType = data.Type;

      if (eventType) {
        switch (eventType) {
          case "SubscriptionConfirmation": {
            const subscribeUrl = data.SubscribeURL;
            await axios.get(subscribeUrl);
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
              `Message type was not "Notification" or "SubscriptionConfirmation", but "${eventType}" instead.`
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
