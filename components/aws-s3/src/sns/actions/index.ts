import { bucketEventTriggerConfiguration } from "./bucketEventTriggerConfiguration";
import { createTopic } from "./createTopic";
import { subscribeToTopic } from "./subscribeToTopic";
import { unsubscribeFromTopic } from "./unsubscribeFromTopic";
import { updateTopicPolicy } from "./updateTopicPolicy";

export default {
  createTopic,
  updateTopicPolicy,
  subscribeToTopic,
  unsubscribeFromTopic,
  bucketEventTriggerConfiguration,
};
