import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

const outlookMvpIntegration = integration({
  name: "Outlook",
  description: "An example integration for Outlook",
  iconPath: "icon.png",
  componentRegistry,
  flows,
  configPages,
});
export default outlookMvpIntegration;
