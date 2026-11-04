import { integration } from "@prismatic-io/spectral";
import { componentRegistry } from "./componentRegistry";
import { configPages } from "./configPages";
import flows from "./flows";

export { componentRegistry } from "./componentRegistry";
export { configPages } from "./configPages";

const slackAgent = integration({
  name: "Simplified Slack Agent",
  description: "",
  iconPath: "icon.png",
  flows,
  configPages,
  componentRegistry,
});
export default slackAgent;
