import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

const openAIAgent = integration({
  name: "OpenAI Agent Example",
  description: "",
  iconPath: "icon.png",
  flows,
  configPages,
  componentRegistry,
});
export default openAIAgent;
