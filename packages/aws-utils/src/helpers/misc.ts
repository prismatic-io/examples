import { util } from "@prismatic-io/spectral";

export const toTrimmedString = (value: unknown): string =>
  util.types.toString(value).trim();

export const toOptionalString = (value: unknown): string | undefined =>
  value ? util.types.toString(value) : undefined;
