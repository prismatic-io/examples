import { componentManifests } from "@prismatic-io/spectral";
import openai from "@component-manifests/openai";
import salesforce from "@component-manifests/salesforce";
import log from "@component-manifests/log";

export const componentRegistry = componentManifests({
  openai,
  salesforce,
  log,
});
