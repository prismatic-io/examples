import { createTopic } from "./createTopic";
import { deleteTopic } from "./deleteTopics";
import { getTopicAttributes } from "./getTopicAttributes";
import { listTopics } from "./listTopics";
import { publishMessage } from "./publishMessage";
import { publishBatchMessages } from "./publishBatchMessages";
import { listSubscriptions } from "./listSubscriptions";
import { subscribe } from "./subscribe";
import { unsubscribe } from "./unsubscribe";
import { publishSms } from "./publishSms";
import { listOptOutNumbers } from "./listOptOutNumbers";

export default {
  createTopic,
  deleteTopic,
  getTopicAttributes,
  listTopics,
  publishMessage,
  publishBatchMessages,
  listSubscriptions,
  subscribe,
  unsubscribe,
  listOptOutNumbers,
  publishSms,
};
