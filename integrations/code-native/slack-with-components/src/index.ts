import { integration } from "@prismatic-io/spectral";
import documentation from "../README.md";
import { componentRegistry } from "./componentRegistry";
import { configPages } from "./configPages";
import flows from "./flows";

export { componentRegistry } from "./componentRegistry";
export { configPages } from "./configPages";

export default integration({
  name: "Slack With Components",
  description:
    "Send Slack alerts using Prismatic's built-in Slack connector for OAuth, channel selection and messaging",
  category: "Communication",
  labels: ["chat", "slack", "example"],
  iconPath: "icon.png",
  documentation,
  flows,
  configPages,
  componentRegistry,
});
