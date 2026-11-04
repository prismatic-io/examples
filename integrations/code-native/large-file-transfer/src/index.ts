import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import documentation from "../README.md";

export { configPages } from "./configPages";

export default integration({
  name: "Large File Transfer",
  description:
    "Copy a file of any size between Dropbox folders in byte-range chunks, one chunk per batch execution, using batchFlowTrigger and an upload session.",
  iconPath: "icon.png",
  documentation,
  flows,
  configPages,
});
