import { component } from "@prismatic-io/spectral";
import actions from "./actions";
import dataSources from "./dataSources";
import connections from "./connections";

export default component({
  key: "mapping-example",
  public: false,
  display: {
    label: "Field Mapping Forms",
    description: "An example of generic mapping using JSON Forms",
    iconPath: "icon.png",
  },
  actions,
  dataSources,
  connections,
});
