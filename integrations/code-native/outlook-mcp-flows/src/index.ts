import { integration } from "@prismatic-io/spectral";
import documentation from "../README.md";
import { componentRegistry } from "./componentRegistry";
import { configPages } from "./configPages";
import flows from "./flows";

export { componentRegistry } from "./componentRegistry";
export { configPages } from "./configPages";

export default integration({
  name: "Outlook MCP Flows",
  description: "Expose Outlook email and calendar operations to AI agents as MCP tools.",
  iconPath: "icon.png",
  documentation,
  componentRegistry,
  flows,
  configPages,
});
