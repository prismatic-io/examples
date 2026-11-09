import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import documentation from "../README.md";

export { configPages } from "./configPages";

export default integration({
  name: "PostgreSQL Polling Trigger",
  description: "PostgreSQL Polling Trigger Example",
  iconPath: "icon.png",
  documentation,
  flows,
  configPages,
});
