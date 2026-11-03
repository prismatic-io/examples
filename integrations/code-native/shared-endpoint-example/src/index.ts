import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";
import documentation from "../README.md";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

export default integration({
  name: "shared-endpoint-example",
  description: "Shared Endpoint Example",
  iconPath: "icon.png",
  flows,
  configPages,
  endpointType: "instance_specific",
  documentation,
  componentRegistry,
});
