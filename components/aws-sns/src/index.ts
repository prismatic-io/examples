import { component } from "@prismatic-io/spectral";
import createTopic from "./actions/createTopic";
import deleteTopic from "./actions/deleteTopics";
import getTopicAttributes from "./actions/getTopicAttributes";
import listTopics from "./actions/listTopics";
import publishMessage from "./actions/publishMessage";
import listSubscriptions from "./actions/listSubscriptions";
import subscribe from "./actions/subscribe";
import unsubscribe from "./actions/unsubscribe";
import publishSms from "./actions/publishSms";
import listOptOutNumbers from "./actions/listOptOutNumbers";
import triggers from "./triggers/trigger";
import { accessKeySecretPair } from "./connections";

export default component({
  key: "aws-sns",
  documentationUrl: "https://prismatic.io/docs/components/aws-sns/",
  public: true,
  display: {
    label: "Amazon SNS",
    description:
      "Manage subscriptions, topics, and messages within Amazon (AWS) SNS",
    iconPath: "icon.png",
    category: "Data Platforms",
  },
  actions: {
    createTopic,
    deleteTopic,
    getTopicAttributes,
    listTopics,
    publishMessage,
    listSubscriptions,
    subscribe,
    unsubscribe,
    listOptOutNumbers,
    publishSms,
  },
  triggers,
  connections: [accessKeySecretPair],
});
