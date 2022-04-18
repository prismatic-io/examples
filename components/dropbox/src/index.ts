import { component } from "@prismatic-io/spectral";
import { oauthConnection } from "./connections";
import actions from "./actions";

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
  connections: [oauthConnection],
});
