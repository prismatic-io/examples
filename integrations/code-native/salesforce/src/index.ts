import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import documentation from "../README.md";

export { configPages } from "./configPages";

export default integration({
  name: "Salesforce",
  description: "Sync data between Salesforce and Acme",
  iconPath: "icon.png",
  category: "CRM",
  documentation,
  flows,
  configPages,
});
