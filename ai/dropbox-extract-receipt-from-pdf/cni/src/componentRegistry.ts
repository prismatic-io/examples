import { componentManifests } from "@prismatic-io/spectral";
import scheduleTriggers from "@component-manifests/schedule-triggers";
import dropbox from "@component-manifests/dropbox";
import openai from "@component-manifests/openai";

export const componentRegistry = componentManifests({
  scheduleTriggers,
  dropbox,
  openai,
});
