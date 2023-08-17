import { component } from "@prismatic-io/spectral";
import { oauthConnection } from "./connections";
import actions from "./actions";
import triggers from "./triggers";
import { handleErrors } from "@prismatic-io/spectral/dist/clients/http";
import dataSources from "./datasources";

export default component({
  key: "dropbox",
  documentationUrl: "https://prismatic.io/docs/components/dropbox/",
  public: true,
  display: {
    label: "Dropbox",
    description: "Manage files stored in Dropbox",
    iconPath: "icon.png",
    category: "Data Platforms",
  },
  actions,
  triggers,
  connections: [oauthConnection],
  dataSources,
  hooks: { error: handleErrors },
});
