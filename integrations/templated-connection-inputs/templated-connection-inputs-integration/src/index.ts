import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

export default integration({
  name: "templated-connection-inputs-integration",
  description:
    "Integration that uses the templated connection inputs component for a connection",
  iconPath: "icon.png",
  flows,
  configPages,
  componentRegistry,
});
