import { EndpointType, integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import documentation from "./documentation.md";

export default integration({
  name: "shared-endpoint-example",
  description: "Shared Endpoint Example",
  iconPath: "icon.png",
  flows,
  configPages,
  endpointType: EndpointType.InstanceSpecific,
  documentation,
});
