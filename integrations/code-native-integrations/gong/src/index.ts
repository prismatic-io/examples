import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

const gong = integration({
  name: "Gong",
  description: "Pull call transcripts and analyze conversations from Gong",
  iconPath: "icon.png",
  componentRegistry,
  flows,
  configPages,
});
export default gong;
