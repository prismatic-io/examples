import branch from "@component-manifests/branch";
import changeDataFormat from "@component-manifests/change-data-format";
import code from "@component-manifests/code";
import collectionTools from "@component-manifests/collection-tools";
import liquidTemplate from "@component-manifests/liquid-template";
import openai from "@component-manifests/openai";
import persistData from "@component-manifests/persist-data";
import slack from "@component-manifests/slack";
import textManipulation from "@component-manifests/text-manipulation";
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
