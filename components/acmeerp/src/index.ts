import { component } from "@prismatic-io/spectral";
import actions from "./actions";

export default component({
  key: "acmeerp",
  public: false,
  display: {
    label: "Acme ERP",
    description: "Manage inventory in Acme ERP",
    iconPath: "icon.png",
  },
  actions,
});
