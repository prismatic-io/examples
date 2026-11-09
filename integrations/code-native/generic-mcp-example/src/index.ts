import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import documentation from "../README.md";

export { configPages } from "./configPages";

export default integration({
  name: "Generic MCP Example",
  description:
    "Present an MCP tool capable of querying for people in 'Acme CRM'",
  iconPath: "icon.png",
  documentation,
  flows,
  configPages,
});
