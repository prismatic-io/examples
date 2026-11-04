import salesforce from "./manifests/salesforce";
import { componentManifests } from "@prismatic-io/spectral";

export const componentRegistry = componentManifests({
  salesforce,
});
