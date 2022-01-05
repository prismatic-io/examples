import { component } from "@prismatic-io/spectral";
import { actions } from "./actions";
import connections from "./connections";

export default component({
  key: "aws-s3",
  documentationUrl: "https://prismatic.io/docs/components/aws-s3",
  public: true,
  display: {
    label: "Amazon S3",
    description: "Manage files within an Amazon (AWS) S3 bucket",
    iconPath: "icon.png",
    category: "Data Platforms",
  },
  connections,
  actions,
});
