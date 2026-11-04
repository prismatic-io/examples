/**
 * This project represents a code-native integration. A customer
 * user will walk through a config wizard (defined in configPages.ts),
 * and flows for that customer (defined in flows.ts) will run.
 *
 * To test this integration, run "npm run test". To publish the integration,
 * run "npm run build" and then "prism integrations:import --open".
 */

import { integration } from "@prismatic-io/spectral";
import flows from "./flows";
import { configPages } from "./configPages";
import { componentRegistry } from "./componentRegistry";
import documentation from "../README.md";

export { configPages } from "./configPages";
export { componentRegistry } from "./componentRegistry";

export default integration({
  name: "salesforce-initial-data-sync",
  description: "Prism-generated Integration",
  iconPath: "icon.png",
  documentation,
  flows,
  configPages,
  componentRegistry,
});
