import { integration } from "@prismatic-io/spectral";
import documentation from "../README.md";
import { configPages } from "./configPages";
import flows from "./flows";

export { configPages } from "./configPages";

export default integration({
  name: "Gong MCP Flows",
  description:
    "Expose Gong call listings, user call searches and call transcripts to AI agents as MCP tools.",
  iconPath: "icon.png",
  documentation,
  flows,
  configPages,
});
