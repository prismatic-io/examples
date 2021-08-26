import { component } from "@prismatic-io/spectral";
import {
  saveFile,
  downloadFile,
  copyFile,
  moveFile,
  deleteFile,
  listFiles,
} from "./actions";

export default component({
  key: "google-cloud-storage",
  documentationUrl: "https://prismatic.io/docs/components/google-cloud-storage",
  public: true,
  display: {
    label: "Google Cloud Storage",
    description:
      "Manage files in a Google Cloud Platform (GCP) Cloud Storage bucket",
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
});
