import { component } from "@prismatic-io/spectral";
import { copyFile } from "./actions/copyFile";
import { deleteFile } from "./actions/deleteFile";
import { downloadFile } from "./actions/downloadFile";
import listFiles from "./actions/listfiles";
import { moveFile } from "./actions/moveFile";
import { saveFile } from "./actions/saveFile";
import { getFile } from "./actions/getFile";
import { listBuckets } from "./actions/listBuckets";
import { createBucket } from "./actions/createBucket";
import { deleteBucket } from "./actions/deleteBucket";
import { getBucket } from "./actions/getBucket";
import { generatePresignedUrl } from "./actions/generatePresignedUrl";
import rawRequest from "./actions/rawRequest";

import connections from "./connections";
import dataSources from "./dataSources";

export default component({
  key: "google-cloud-storage",
  documentationUrl:
    "https://prismatic.io/docs/components/google-cloud-storage/",
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
    ...listFiles,
    getFile,
    listBuckets,
    createBucket,
    getBucket,
    deleteBucket,
    rawRequest,
    generatePresignedUrl,
  },
  connections,
  dataSources,
});
