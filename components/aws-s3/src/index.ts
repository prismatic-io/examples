import { component } from "@prismatic-io/spectral";
import { actions } from "./actions";
import { authorizationMethods } from "./auth";

export default component({
  key: "aws-s3",
  documentationUrl: "https://prismatic.io/docs/components/aws-s3",
  public: true,
  display: {
    label: "Amazon S3",
    description: "Manage objects (files) within an Amazon S3 bucket",
    iconPath: "icon.png",
    category: "Data Platforms",
  },
  actions,
  authorization: {
    required: true,
    methods: authorizationMethods,
  },
});
