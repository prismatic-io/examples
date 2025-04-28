import { component } from "@prismatic-io/spectral";
import actions from "./actions";
import connections from "./connections";

export default component({
  key: "templated-connection-inputs",
  public: false,
  display: {
    label: "Templated connection inputs component",
    description: "Template input connections",
    iconPath: "icon.png",
  },
  actions,
  connections,
});
