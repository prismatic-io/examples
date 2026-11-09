import { integration } from "@prismatic-io/spectral";
import documentation from "../README.md";
import { configPages } from "./configPages";
import flows from "./flows";

export { configPages } from "./configPages";

export default integration({
  name: "Slack Without Components",
  description:
    "Send Slack alerts using a hand-written OAuth connection, HTTP client and data source instead of a Prismatic connector",
  category: "Communication",
  labels: ["chat", "slack", "example"],
  iconPath: "icon.png",
  documentation,
  flows,
  configPages,
});
