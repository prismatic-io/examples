import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

const salesforceOpportunities = integration({
  name: "Salesforce",
  description: "Manage sales pipeline opportunities and generate reports",
  iconPath: "icon.png",
  componentRegistry,
  flows,
  configPages,
});
export default salesforceOpportunities;
