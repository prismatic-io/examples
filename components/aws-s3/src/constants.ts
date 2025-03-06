import {
  EventBridgeConfiguration,
  LambdaFunctionConfiguration,
  ObjectAttributes,
  QueueConfiguration,
  TopicConfiguration,
} from "@aws-sdk/client-s3";

export const INPUT_EVENT_TYPES_MODEL = [
  { label: "s3:ObjectCreated:*", value: "s3:ObjectCreated:*" },
  { label: "s3:ObjectCreated:Put", value: "s3:ObjectCreated:Put" },
  { label: "s3:ObjectCreated:Post", value: "s3:ObjectCreated:Post" },
  { label: "s3:ObjectCreated:Copy", value: "s3:ObjectCreated:Copy" },
  {
    label: "s3:ObjectCreated:CompleteMultipartUpload",
    value: "s3:ObjectCreated:CompleteMultipartUpload",
  },
  { label: "s3:ObjectRemoved:*", value: "s3:ObjectRemoved:*" },
  { label: "s3:ObjectRemoved:Delete", value: "s3:ObjectRemoved:Delete" },
  {
    label: "s3:ObjectRemoved:DeleteMarkerCreated",
    value: "s3:ObjectRemoved:DeleteMarkerCreated",
  },
  { label: "s3:ObjectRestore:*", value: "s3:ObjectRestore:*" },
  { label: "s3:ObjectRestore:Post", value: "s3:ObjectRestore:Post" },
  { label: "s3:ObjectRestore:Completed", value: "s3:ObjectRestore:Completed" },
  { label: "s3:ObjectRestore:Delete", value: "s3:ObjectRestore:Delete" },
  {
    label: "s3:ReducedRedundancyLostObject",
    value: "s3:ReducedRedundancyLostObject",
  },
  { label: "s3:Replication:*", value: "s3:Replication:*" },
  {
    label: "s3:Replication:OperationFailedReplication",
    value: "s3:Replication:OperationFailedReplication",
  },
  {
    label: "s3:Replication:OperationMissedThreshold",
    value: "s3:Replication:OperationMissedThreshold",
  },
  {
    label: "s3:Replication:OperationReplicatedAfterThreshold",
    value: "s3:Replication:OperationReplicatedAfterThreshold",
  },
  {
    label: "s3:Replication:OperationNotTracked",
    value: "s3:Replication:OperationNotTracked",
  },
  { label: "s3:LifecycleExpiration:*", value: "s3:LifecycleExpiration:*" },
  {
    label: "s3:LifecycleExpiration:Delete",
    value: "s3:LifecycleExpiration:Delete",
  },
  {
    label: "s3:LifecycleExpiration:DeleteMarkerCreated",
    value: "s3:LifecycleExpiration:DeleteMarkerCreated",
  },
  { label: "s3:LifecycleTransition", value: "s3:LifecycleTransition" },
  { label: "s3:IntelligentTiering", value: "s3:IntelligentTiering" },
  { label: "s3:ObjectTagging:*", value: "s3:ObjectTagging:*" },
  { label: "s3:ObjectTagging:Put", value: "s3:ObjectTagging:Put" },
  { label: "s3:ObjectTagging:Delete", value: "s3:ObjectTagging:Delete" },
  { label: "s3:ObjectAcl:Put", value: "s3:ObjectAcl:Put" },
];

export const TOPIC_CONFIGURATIONS_EXAMPLE: TopicConfiguration[] = [
  {
    Id: "topic-1",
    TopicArn: "arn:aws:sns:us-west-2:123456789012:mytopic",
    Events: ["s3:ObjectCreated:*"],
    Filter: {
      Key: {
        FilterRules: [
          {
            Name: "prefix",
            Value: "images/",
          },
        ],
      },
    },
  },
];

export const QUEUE_CONFIGURATIONS_EXAMPLE: QueueConfiguration[] = [
  {
    Id: "queue-1",
    QueueArn: "arn:aws:sqs:us-west-2:123456789012:myqueue",
    Events: ["s3:ObjectCreated:*"],
    Filter: {
      Key: {
        FilterRules: [
          {
            Name: "prefix",
            Value: "images/",
          },
        ],
      },
    },
  },
];

export const LAMBDA_FUNCTION_CONFIGURATIONS_EXAMPLE: LambdaFunctionConfiguration[] =
  [
    {
      Id: "lambda-1",
      LambdaFunctionArn:
        "arn:aws:lambda:us-west-2:123456789012:function:my-function",
      Events: ["s3:ObjectCreated:*"],
      Filter: {
        Key: {
          FilterRules: [
            {
              Name: "prefix",
              Value: "images/",
            },
          ],
        },
      },
    },
  ];

export const EVENT_BRIDGE_CONFIGURATION_EXAMPLE: EventBridgeConfiguration = {
  Id: "event-bridge-1",
  EventBridgeArn: "arn:aws:eventbridge:us-west-2:123456789012:myeventbridge",
  Events: ["s3:ObjectCreated:*"],
  Filter: {
    Key: {
      FilterRules: [
        {
          Name: "prefix",
          Value: "images/",
        },
      ],
    },
  },
};

export const OBJECT_ATTRIBUTES: ObjectAttributes[] = [
  "ETag",
  "Checksum",
  "ObjectParts",
  "StorageClass",
  "ObjectSize",
];
