import { component } from "@prismatic-io/spectral";
import actions from "./actions";
import { basicAuth } from "./config";
export default component({
  key: `salesforce-soap`,
  public: false,
  display: {
    label: "Salesforce SOAP",
    description: `Interact with the Salesforce SOAP Web Service`,
    iconPath: `icon.png`,
  },
  actions,
  connections: [basicAuth],
});
