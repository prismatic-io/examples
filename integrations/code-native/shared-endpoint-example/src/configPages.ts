/**
 * This integration highlights how to use a shared endpoint type and
 * does not require any configuration.
 */

import { configPage } from "@prismatic-io/spectral";

export const configPages = {
  Connections: configPage({
    elements: {},
  }),
};

export type ConfigPages = typeof configPages;
