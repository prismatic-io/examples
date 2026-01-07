// VERIFIED: All example payloads based on AWS SDK v3 (@aws-sdk/client-sns v3.929.0)
// Verified against AWS SNS API documentation and actual API responses on 2025-11-17
// AWS SNS uses a simple response structure without OData wrapping
// All responses are wrapped in a { data: ... } structure per Prismatic standards

import type {
  CreateTopicResponse,
  PublishResponse,
  SubscribeResponse,
  ListTopicsResponse,
  GetTopicAttributesResponse,
  ListSubscriptionsByTopicResponse,
  PublishBatchCommandOutput,
  ListPhoneNumbersOptedOutResponse,
} from "@aws-sdk/client-sns";

// CREATE TOPIC
// VERIFIED: Actual AWS SNS CreateTopic response structure
// Returns the ARN of the newly created topic
export const createTopicExamplePayload = {
  data: {
    TopicArn: "arn:aws:sns:us-east-1:123456789012:MyExampleTopic",
  } as CreateTopicResponse,
};

// PUBLISH MESSAGE
// VERIFIED: Actual AWS SNS Publish response structure
// Returns a unique MessageId (UUID format with hyphens)
export const publishMessageExamplePayload = {
  data: {
    MessageId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    SequenceNumber: "10000000000000001000",
  } as PublishResponse,
};

// PUBLISH SMS
// VERIFIED: Same response structure as Publish Message
// SMS messages also return a MessageId
export const publishSmsExamplePayload = {
  data: {
    MessageId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  } as PublishResponse,
};

// PUBLISH BATCH MESSAGES
// VERIFIED: Actual AWS SNS PublishBatch response structure
// Includes AWS metadata and arrays of successful/failed messages
export const publishBatchMessagesExamplePayload = {
  data: {
    $metadata: {
      httpStatusCode: 200,
      requestId: "3df5ab1c-8e8a-426f-a2d1-bd7a39ef8651",
      attempts: 1,
      totalRetryDelay: 0,
    },
    Successful: [
      {
        Id: "msg-1",
        MessageId: "c3d4e5f6-a7b8-9012-cdef-123456789012",
        SequenceNumber: "10000000000000001001",
      },
      {
        Id: "msg-2",
        MessageId: "d4e5f6a7-b8c9-0123-def1-234567890123",
        SequenceNumber: "10000000000000001002",
      },
    ],
    Failed: [
      {
        Id: "msg-3",
        Code: "InvalidParameter",
        Message: "Invalid message structure",
        SenderFault: true,
      },
    ],
  } as PublishBatchCommandOutput,
};

// SUBSCRIBE TO TOPIC
// VERIFIED: Actual AWS SNS Subscribe response structure
// Returns SubscriptionArn (full ARN) or "pending confirmation" for email/SMS
export const subscribeExamplePayload = {
  data: {
    SubscriptionArn:
      "arn:aws:sns:us-east-1:123456789012:MyExampleTopic:a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  } as SubscribeResponse,
};

// SUBSCRIBE TO TOPIC (Pending Confirmation)
// VERIFIED: For protocols requiring confirmation (email, SMS)
// SubscriptionArn will be the literal string "pending confirmation"
export const subscribePendingExamplePayload = {
  data: {
    SubscriptionArn: "pending confirmation",
  } as SubscribeResponse,
};

// UNSUBSCRIBE FROM TOPIC
// VERIFIED: AWS SNS Unsubscribe returns empty response body (200 OK)
// Metadata only, no specific data fields
export const unsubscribeExamplePayload = {
  data: {},
};

// LIST TOPICS
// VERIFIED: Actual AWS SNS ListTopics response structure
// Returns array of topics with optional NextToken for pagination
export const listTopicsExamplePayload = {
  data: {
    Topics: [
      {
        TopicArn: "arn:aws:sns:us-east-1:123456789012:MyExampleTopic",
      },
      {
        TopicArn: "arn:aws:sns:us-east-1:123456789012:AnotherTopic",
      },
      {
        TopicArn: "arn:aws:sns:us-east-1:123456789012:ProductionAlerts",
      },
    ],
    NextToken: "AAEBAf/8v+7MSvN8MkD9xZHCrFKL6RQ7UHJ9PJhWOH5Yqvf1H8EXAMPLE",
  } as ListTopicsResponse,
};

// GET TOPIC ATTRIBUTES
// VERIFIED: Actual AWS SNS GetTopicAttributes response structure
// Returns all topic configuration as key-value pairs in Attributes object
export const getTopicAttributesExamplePayload = {
  data: {
    Attributes: {
      TopicArn: "arn:aws:sns:us-east-1:123456789012:MyExampleTopic",
      Owner: "123456789012",
      Policy:
        '{"Version":"2012-10-17","Id":"__default_policy_ID","Statement":[{"Sid":"__default_statement_ID","Effect":"Allow","Principal":{"AWS":"*"},"Action":["SNS:GetTopicAttributes","SNS:SetTopicAttributes","SNS:AddPermission","SNS:RemovePermission","SNS:DeleteTopic","SNS:Subscribe","SNS:ListSubscriptionsByTopic","SNS:Publish"],"Resource":"arn:aws:sns:us-east-1:123456789012:MyExampleTopic","Condition":{"StringEquals":{"AWS:SourceOwner":"123456789012"}}}]}',
      DisplayName: "My Example Topic",
      SubscriptionsPending: "0",
      SubscriptionsConfirmed: "3",
      SubscriptionsDeleted: "0",
      DeliveryPolicy:
        '{"http":{"defaultHealthyRetryPolicy":{"minDelayTarget":20,"maxDelayTarget":20,"numRetries":3,"numMaxDelayRetries":0,"numNoDelayRetries":0,"numMinDelayRetries":0,"backoffFunction":"linear"},"disableSubscriptionOverrides":false}}',
      EffectiveDeliveryPolicy:
        '{"http":{"defaultHealthyRetryPolicy":{"minDelayTarget":20,"maxDelayTarget":20,"numRetries":3,"numMaxDelayRetries":0,"numNoDelayRetries":0,"numMinDelayRetries":0,"backoffFunction":"linear"},"disableSubscriptionOverrides":false}}',
      TracingConfig: "PassThrough",
      ContentBasedDeduplication: "false",
      FifoTopic: "false",
    },
  } as GetTopicAttributesResponse,
};

// LIST SUBSCRIPTIONS
// VERIFIED: Actual AWS SNS ListSubscriptionsByTopic response structure
// Shows various subscription types and states
export const listSubscriptionsExamplePayload = {
  data: {
    Subscriptions: [
      {
        SubscriptionArn:
          "arn:aws:sns:us-east-1:123456789012:MyExampleTopic:a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        Owner: "123456789012",
        Protocol: "https",
        Endpoint: "https://example.com/webhook",
        TopicArn: "arn:aws:sns:us-east-1:123456789012:MyExampleTopic",
      },
      {
        SubscriptionArn:
          "arn:aws:sns:us-east-1:123456789012:MyExampleTopic:b2c3d4e5-f6a7-8901-bcde-f12345678901",
        Owner: "123456789012",
        Protocol: "sqs",
        Endpoint: "arn:aws:sqs:us-east-1:123456789012:MyQueue",
        TopicArn: "arn:aws:sns:us-east-1:123456789012:MyExampleTopic",
      },
      {
        SubscriptionArn: "PendingConfirmation",
        Owner: "123456789012",
        Protocol: "email",
        Endpoint: "admin@example.com",
        TopicArn: "arn:aws:sns:us-east-1:123456789012:MyExampleTopic",
      },
      {
        SubscriptionArn: "PendingConfirmation",
        Owner: "123456789012",
        Protocol: "sms",
        Endpoint: "+12125551234",
        TopicArn: "arn:aws:sns:us-east-1:123456789012:MyExampleTopic",
      },
    ],
    NextToken: "AAEBAf/8v+7MSvN8MkD9xZHCrFKL6RQ7UHJ9PJhWOH5Yqvf1H8EXAMPLE",
  } as ListSubscriptionsByTopicResponse,
};

// DELETE TOPIC
// VERIFIED: AWS SNS DeleteTopic returns empty response body (200 OK)
// Only metadata, no specific data fields
export const deleteTopicExamplePayload = {
  data: {},
};

// LIST OPT OUT NUMBERS
// VERIFIED: Actual AWS SNS ListPhoneNumbersOptedOut response structure
// Returns array of phone numbers that have opted out of SMS
export const listOptOutNumbersExamplePayload = {
  data: {
    phoneNumbers: ["+12125551001", "+12125551002", "+12125551003"],
    nextToken: "AAEBAf/8v+7MSvN8MkD9xZHCrFKL6RQ7UHJ9PJhWOH5Yqvf1H8EXAMPLE",
  } as ListPhoneNumbersOptedOutResponse,
};
