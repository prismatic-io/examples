import slack from "./manifests/slack";
import { componentManifests } from "@prismatic-io/spectral";

export const componentRegistry = componentManifests({
  slack,
});
