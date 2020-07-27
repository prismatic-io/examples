import { component } from "@prismatic-io/spectral";
import { version } from "../package.json";
import actions from "./actions";

export default component({
  key: "progix-sig-check",
  public: false,
  version,
  display: {
    label: "Progix Verify Request Signature",
    description:
      "Verify that a Webhook request originated from a Progix application",
    iconPath: "icon.png",
  },
  actions: {
    ...actions,
  },
});
