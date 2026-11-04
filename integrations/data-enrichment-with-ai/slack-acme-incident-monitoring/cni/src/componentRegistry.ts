import { componentManifests } from "@prismatic-io/spectral";
import openai from "@component-manifests/openai";
import liquidTemplate from "@component-manifests/liquid-template";
import branch from "@component-manifests/branch";
import slack from "@component-manifests/slack";
import code from "@component-manifests/code";
import persistData from "@component-manifests/persist-data";
import changeDataFormat from "@component-manifests/change-data-format";
import textManipulation from "@component-manifests/text-manipulation";
import collectionTools from "@component-manifests/collection-tools";

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
