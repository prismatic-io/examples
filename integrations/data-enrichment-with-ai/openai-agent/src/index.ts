import { integration } from "@prismatic-io/spectral";
import { componentRegistry } from "./componentRegistry";
import { configPages } from "./configPages";
import flows from "./flows";

export { componentRegistry } from "./componentRegistry";
export { configPages } from "./configPages";

const openAIAgent = integration({
  name: "OpenAI Agent Example",
  description: "",
  iconPath: "icon.png",
  flows,
  configPages,
  componentRegistry,
});
export default openAIAgent;
