import { component } from "@prismatic-io/spectral";
import { version } from "../package.json";
import {
  saveFile,
  downloadFile,
  copyFile,
  moveFile,
  deleteFile,
  listFiles,
} from "./actions";
import { authorizationMethods } from "./auth";

export default component({
  key: "google-cloud-storage",
  documentationUrl: "https://prismatic.io/docs/components/google-cloud-storage",
  public: true,
  version,
  display: {
    label: "Google Cloud Storage",
    description: "Interact with GCP objects and buckets",
    iconPath: "icon.png",
  },
  actions: {
    saveFile,
    downloadFile,
    copyFile,
    moveFile,
    deleteFile,
    listFiles,
  },
  authorization: {
    required: true,
    methods: authorizationMethods,
  },
});
