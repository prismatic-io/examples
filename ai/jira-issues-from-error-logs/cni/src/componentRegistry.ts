import { componentManifests } from "@prismatic-io/spectral";
import openai from "@component-manifests/openai";
import atlassianJira from "@component-manifests/atlassian-jira";

export const componentRegistry = componentManifests({
  openai,
  atlassianJira,
});
