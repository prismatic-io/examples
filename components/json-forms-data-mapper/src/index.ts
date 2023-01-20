import { component } from "@prismatic-io/spectral";
import dataSources from "./dataSources";

export default component({
  key: "jsonFormsDataMapper",
  public: false,
  display: {
    label: "Jira/Acme Data Mapper",
    description: "Map Jira issue types to Acme issue types",
    iconPath: "icon.png",
  },
  dataSources,
});
