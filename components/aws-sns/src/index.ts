import { component } from "@prismatic-io/spectral";
import actions from "./actions";
import triggers from "./triggers/trigger";
import connections from "./connections";

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
  actions,
  triggers,
  connections,
});
