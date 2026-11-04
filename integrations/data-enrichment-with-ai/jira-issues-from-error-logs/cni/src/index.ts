import { integration } from "@prismatic-io/spectral";
import { componentRegistry } from "./componentRegistry";
import { configPages } from "./configPages";
import flows from "./flows";

export { componentRegistry } from "./componentRegistry";
export { configPages } from "./configPages";

const jiraIntegration = integration({
  name: "Jira",
  description: "",
  iconPath: "icon.png",
  componentRegistry,
  flows,
  configPages,
});
export default jiraIntegration;
