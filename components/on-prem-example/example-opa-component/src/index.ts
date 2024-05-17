import { component } from "@prismatic-io/spectral";
import actions from "./actions";
import connections from "./connections";

export default component({
  key: "exampleOpaComponent",
  public: false,
  display: {
    label: "example-opa-component",
    description: "Prism-generated Component",
    iconPath: "icon.png",
  },
  actions,
  connections,
});
