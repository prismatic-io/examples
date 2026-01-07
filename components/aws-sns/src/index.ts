import { component } from "@prismatic-io/spectral";
import actions from "./actions";
import triggers from "./triggers/trigger";
import connections from "./connections";
import { handleErrors } from "@prismatic-io/spectral/dist/clients/http";
import dataSources from "./dataSources";

export default component({
  key: "aws-sns",
  documentationUrl: "https://prismatic.io/docs/components/aws-sns/",
  public: true,
  display: {
    label: "Amazon SNS",
    description: "Manage topics, subscriptions, and messages in Amazon SNS.",
    iconPath: "icon.png",
    category: "Data Platforms",
  },
  actions,
  triggers,
  connections,
  dataSources,
  hooks: {
    error: handleErrors,
  },
});
