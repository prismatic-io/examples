import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import documentation from "../README.md";

export { configPages } from "./configPages";

export default integration({
  name: "Simple Initial Data Sync",
  description:
    "Simple initial data sync example for loading large data sets in batches",
  iconPath: "icon.png",
  documentation,
  flows,
  configPages,
});
