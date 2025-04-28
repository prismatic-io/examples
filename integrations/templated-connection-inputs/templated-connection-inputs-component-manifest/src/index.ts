import actions from "./actions";
import connections from "./connections";
import dataSources from "./dataSources";
import triggers from "./triggers";

export { actions, connections, dataSources, triggers };

export default {
  key: "templated-connection-inputs",
  public: false,
  signature: "dd440a0eeca1d20d86b4f0ea811d467c0f2cedf8",
  actions,
  dataSources,
  connections,
  triggers,
} as const;
