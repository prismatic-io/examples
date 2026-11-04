import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import documentation from "../README.md";

export { configPages } from "./configPages";

export default integration({
  name: "Process Large Files",
  description: "Process large files efficiently using Node.js streams.",
  iconPath: "icon.png",
  documentation,
  flows,
  configPages,
});
