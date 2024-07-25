import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

export default integration({
  name: "asana-example",
  description: "Prism-generated Integration",
  iconPath: "icon.png",
  flows,
  configPages,
  componentRegistry,
});
