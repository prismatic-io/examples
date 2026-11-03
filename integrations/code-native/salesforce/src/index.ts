import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";
import documentation from "../README.md";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

export default integration({
  name: "Salesforce",
  description: "Sync data between Salesforce and Acme",
  iconPath: "icon.png",
  category: "CRM",
  documentation,
  flows,
  configPages,
  componentRegistry,
});
