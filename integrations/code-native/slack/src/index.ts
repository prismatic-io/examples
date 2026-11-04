import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";
import documentation from "../README.md";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

export default integration({
  name: "Slack",
  description: "Send todo items to Slack on a schedule",
  iconPath: "icon.png",
  category: "Communication",
  documentation,
  flows,
  configPages,
  componentRegistry,
});
