import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

const salesforceIntegration = integration({
  name: "Salesforce",
  description: "",
  iconPath: "icon.png",
  componentRegistry,
  flows,
  configPages,
});
export default salesforceIntegration;
