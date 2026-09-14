import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";
import documentation from "../README.md";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

export default integration({
  name: "salesforce-initial-data-sync",
  description: "Prism-generated Integration",
  iconPath: "icon.png",
  documentation,
  flows,
  configPages,
  componentRegistry,
});
