import type { ComponentManifest, ConfigPage, ScopedConfigVar } from "@prismatic-io/spectral";

// @ts-ignore: these imports should stay here even if unused or undefined. ts-ignore is used to avoid type errors.
import type { configPages, componentRegistry, userLevelConfigPages, scopedConfigVars } from "../src";

type IsAny<T> = 0 extends 1 & T ? true : false;

type TConfigPages = IsAny<typeof configPages> extends true
  ? { [key: string]: ConfigPage }
  : typeof configPages;

type TUserLevelConfigPages = IsAny<typeof userLevelConfigPages> extends true
  ? { [key: string]: ConfigPage }
  : typeof userLevelConfigPages;

type TComponentRegistry = IsAny<typeof componentRegistry> extends true
  ? { [key: string]: ComponentManifest }
  : typeof componentRegistry;

type TScopedConfigVarMap = IsAny<typeof scopedConfigVars> extends true
  ? { [key: string]: ScopedConfigVar }
  : typeof scopedConfigVars;

declare module "@prismatic-io/spectral" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IntegrationDefinitionConfigPages extends TConfigPages {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IntegrationDefinitionUserLevelConfigPages extends TUserLevelConfigPages {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IntegrationDefinitionComponentRegistry extends TComponentRegistry {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IntegrationDefinitionScopedConfigVars extends TScopedConfigVarMap {}
}
