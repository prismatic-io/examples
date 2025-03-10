import { component } from "@prismatic-io/spectral";
import actions from "./actions";
import connections from "./connections";

export default component({
  key: "grpc-example",
  public: false,
  display: {
    label: "gRPC Example",
    description: "How to connect to a gRPC server",
    iconPath: "icon.png",
  },
  actions,
  connections,
});
