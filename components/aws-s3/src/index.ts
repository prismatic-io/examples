import { component } from "@prismatic-io/spectral";
import { handleErrors } from "@prismatic-io/spectral/dist/clients/http";
import { actions } from "./actions";
import connections from "./connections";
import dataSources from "./dataSources";
import triggers from "./triggers";

export default component({
  key: "aws-s3",
  documentationUrl: "https://prismatic.io/docs/components/aws-s3/",
  public: true,
  display: {
    label: "Amazon S3",
    description: "Manage objects and buckets in Amazon S3.",
    iconPath: "icon.png",
    category: "Data Platforms",
  },
  connections,
  actions,
  dataSources,
  triggers,
  hooks: {
    error: handleErrors,
  },
});
