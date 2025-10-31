import { component } from "@prismatic-io/spectral";
import { handleErrors } from "@prismatic-io/spectral/dist/clients/http";
import actions from "./actions";
import connections from "./connections";
import dataSources from "./dataSources";
import triggers from "./triggers";

export default component({
  key: "bamboohr",
  public: true,
  documentationUrl: "https://prismatic.io/docs/components/bamboohr/",
  display: {
    label: "BambooHR",
    description: "Manage employees and HR data in the BambooHR platform",
    iconPath: "icon.png",
    category: "Application Connectors",
  },
  actions,
  connections,
  triggers,
  dataSources,
  hooks: {
    error: handleErrors,
  },
});
