import { component } from "@prismatic-io/spectral";
import { version } from "../package.json";
import { actions } from "./actions";
import { authorizationMethods } from "./auth";

export default component({
  key: "aws-s3",
  public: true,
  version,
  display: {
    label: "AWS S3",
    description: "Interact with AWS S3 objects and buckets",
    iconPath: "icon.png",
  },
  actions: {
    ...actions,
  },
  authorization: {
    required: true,
    methods: authorizationMethods,
  },
});
