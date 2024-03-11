import { component } from "@prismatic-io/spectral";
import actions from "./actions";
import connections from "./connections";

export default component({
  key: "fluent-commerce",
  documentationUrl: "https://prismatic.io/docs/components/fluent-commerce/",
  public: true,
  display: {
    label: "Fluent Commerce",
    description: "Manage orders within Fluent Commerce",
    iconPath: "icon.png",
    category: "Application Connectors",
  },
  actions,
  connections,
});
