import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

const slackAgent = integration({
  name: "Slack Agent",
  description: "",
  iconPath: "icon.png",
  flows,
  configPages,
  componentRegistry,
});
export default slackAgent;
