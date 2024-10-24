import { util } from "@prismatic-io/spectral";

export const toTrimmedString = (value: unknown): string =>
  util.types.toString(value).trim();
