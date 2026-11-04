import dropbox from "@component-manifests/dropbox";
import openai from "@component-manifests/openai";
import scheduleTriggers from "@component-manifests/schedule-triggers";
import { componentManifests } from "@prismatic-io/spectral";

/**
 * Some published @component-manifests packages declare each action's
 * `outputSchema.schema` as a JSON string, while spectral's ComponentManifest
 * type expects a JSON Schema object. Output schemas are descriptive only (they
 * aren't used when invoking actions), so we drop them from the manifest's type.
 */
type WithoutOutputSchemas<T extends { actions: object }> = Omit<T, "actions"> & {
  actions: { [K in keyof T["actions"]]: Omit<T["actions"][K], "outputSchema"> };
};
const withoutOutputSchemas = <T extends { actions: object }>(manifest: T) =>
  manifest as unknown as WithoutOutputSchemas<T>;

export const componentRegistry = componentManifests({
  scheduleTriggers,
  dropbox: withoutOutputSchemas(dropbox),
  openai,
});
