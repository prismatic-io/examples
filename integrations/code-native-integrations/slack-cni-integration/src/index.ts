import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";

export default integration({
  name: "Example Slack Integration with CNI",
  description: "My code-native Slack integration!",
  category: "Communication",
  labels: ["chat", "beta", "paid"],
  iconPath: "icon.png",
  flows,
  configPages,
  version: "1.2.4",
});
