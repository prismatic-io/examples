import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";
import documentation from "../README.md";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

export default integration({
  name: "Salesforce MCP Example",
  description:
    "Manage sales pipeline opportunities and generate reports using MCP and Salesforce data.",
  iconPath: "icon.png",
  componentRegistry,
  flows,
  configPages,
  documentation,
});
