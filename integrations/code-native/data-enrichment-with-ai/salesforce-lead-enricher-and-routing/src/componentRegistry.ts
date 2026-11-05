import log from "./manifests/log";
import openai from "./manifests/openai";
import salesforce from "./manifests/salesforce";
import { componentManifests } from "@prismatic-io/spectral";

export const componentRegistry = componentManifests({
  openai,
  salesforce: salesforce,
  log,
});
