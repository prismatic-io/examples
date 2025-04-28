import type { Connection } from "@prismatic-io/spectral";

export interface PrintConnectionValues {
  /**
   * Acme Connection
   *
   */
  connection: Connection;
}

/**
 * Print connection info
 *
 * @description Return the values attached to a connection
 */
export const printConnection = {
  key: "printConnection",
  perform: <TReturn>(_values: PrintConnectionValues): Promise<TReturn> =>
    Promise.resolve<TReturn>({} as TReturn),
  inputs: {
    connection: {
      inputType: "connection",
      collection: undefined,
      default: undefined,
      required: true,
    },
  },
} as const;
