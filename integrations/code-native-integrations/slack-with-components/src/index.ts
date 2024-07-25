import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

export default integration({
  name: "Example Slack Integration with CNI and built-in components",
  description: "My code-native Slack integration!",
  category: "Communication",
  labels: ["chat", "beta", "paid"],
  iconPath: "icon.png",
  flows,
  configPages,
  componentRegistry,
  version: "1.2.4",
});
