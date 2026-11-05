import dropbox from "./manifests/dropbox";
import openai from "./manifests/openai";
import scheduleTriggers from "./manifests/schedule-triggers";
import { componentManifests } from "@prismatic-io/spectral";

export const componentRegistry = componentManifests({
  scheduleTriggers,
  dropbox: dropbox,
  openai,
});
