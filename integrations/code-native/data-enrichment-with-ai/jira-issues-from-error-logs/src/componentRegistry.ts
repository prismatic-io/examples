import atlassianJira from "./manifests/atlassian-jira";
import openai from "./manifests/openai";
import { componentManifests } from "@prismatic-io/spectral";

export const componentRegistry = componentManifests({
  openai,
  atlassianJira: atlassianJira,
});
