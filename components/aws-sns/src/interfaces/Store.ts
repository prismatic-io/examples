export interface Store {
  [key: string]: {
    subscriptionArn?: unknown;
    previousAwsRegion?: unknown;
    previousTopicArn?: unknown;
  };
}
