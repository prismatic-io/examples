import { component } from "@prismatic-io/spectral";
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
  display: {
    label: "Google Cloud Storage",
    description: "Manage objects (files) in a Google Cloud Storage bucket",
    iconPath: "icon.png",
    category: "Data Platforms",
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
