import { componentManifests } from "@prismatic-io/spectral";
import slack from "./manifests/slack";

export const componentRegistry = componentManifests({
  slack,
});
