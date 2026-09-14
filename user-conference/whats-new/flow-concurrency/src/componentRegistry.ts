/**
 * Your code-native integration can invoke existing connectors.
 * This is where you declare which connectors your code-native
 * integration uses. For more information, see
 * https://prismatic.io/docs/integrations/code-native/existing-components/
 */

import { componentManifests } from "@prismatic-io/spectral";

export const componentRegistry = componentManifests({
  // This is where you'll register your component manifests
});
