import branch from "./manifests/branch";
import changeDataFormat from "./manifests/change-data-format";
import code from "./manifests/code";
import collectionTools from "./manifests/collection-tools";
import liquidTemplate from "./manifests/liquid-template";
import openai from "./manifests/openai";
import persistData from "./manifests/persist-data";
import slack from "./manifests/slack";
import textManipulation from "./manifests/text-manipulation";
import { componentManifests } from "@prismatic-io/spectral";

export const componentRegistry = componentManifests({
  openai,
  liquidTemplate,
  branch,
  slack,
  code,
  persistData,
  changeDataFormat,
  textManipulation,
  collectionTools,
});
