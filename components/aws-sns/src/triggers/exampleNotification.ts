import { TriggerPayload } from "@prismatic-io/spectral";

export const snsExampleHeaders = {
  "x-amz-sns-message-type": "Notification",
  "x-amz-sns-message-id": "da41e39f-ea4d-435a-b922-c6aae3915ebe",
  "x-amz-sns-topic-arn": "arn:aws:sns:us-west-2:123456789012:MyTopic",
  "x-amz-sns-subscription-arn":
    "arn:aws:sns:us-west-2:123456789012:MyTopic:2bcfbf39-05c3-41de-beaa-fcfcc21c8f55",
  "Content-Length": "761",
  "Content-Type": "text/plain; charset=UTF-8",
  Host: "ec2-50-17-44-49.compute-1.amazonaws.com",
  Connection: "Keep-Alive",
  "User-Agent": "Amazon Simple Notification Service Agent",
};

export const snsExampleBody = {
  Type: "Notification",
  MessageId: "da41e39f-ea4d-435a-b922-c6aae3915ebe",
  TopicArn: "arn:aws:sns:us-west-2:123456789012:MyTopic",
  Subject: "test",
  Message: "test message",
  Timestamp: "2012-04-25T21:49:25.719Z",
  SignatureVersion: "1",
  Signature:
    "EXAMPLElDMXvB8r9R83tGoNn0ecwd5UjllzsvSvbItzfaMpN2nk5HVSw7XnOn/49IkxDKz8YrlH2qJXj2iZB0Zo2O71c4qQk1fMUDi3LGpij7RCW7AW9vYYsSqIKRnFS94ilu7NFhUzLiieYr4BKHpdTmdD6c0esKEYBpabxDSc=",
  SigningCertURL:
    "https://sns.us-west-2.amazonaws.com/SimpleNotificationService-f3ecfb7224c7233fe7bb5f59f96de52f.pem",
  UnsubscribeURL:
    "https://sns.us-west-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-west-2:123456789012:MyTopic:2bcfbf39-05c3-41de-beaa-fcfcc21c8f55",
};

export const snsExamplePayload: TriggerPayload = {
  headers: snsExampleHeaders,
  queryParameters: {},
  rawBody: {
    data: {},
  },
  webhookUrls: {},
  webhookApiKeys: {},
  customer: {
    externalId: "abc-123",
    name: "Example Corp",
  },
  body: {
    data: snsExampleBody,
  },
};
