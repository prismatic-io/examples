import { component } from "@prismatic-io/spectral";
import { handleErrors } from "@prismatic-io/spectral/dist/clients/http";
import { copyFile } from "./actions/copyFile";
import { createBucket } from "./actions/createBucket";
import { deleteBucket } from "./actions/deleteBucket";
import { deleteFile } from "./actions/deleteFile";
import { downloadFile } from "./actions/downloadFile";
import { generatePresignedUrl } from "./actions/generatePresignedUrl";
import { getBucket } from "./actions/getBucket";
import { getFile } from "./actions/getFile";
import { listBuckets } from "./actions/listBuckets";
import listFiles from "./actions/listfiles";
import { moveFile } from "./actions/moveFile";
import multipartUpload from "./actions/multipartUpload";
import rawRequest from "./actions/rawRequest";
import { saveFile } from "./actions/saveFile";
import connections from "./connections";
import dataSources from "./dataSources";

export default component({
	key: "google-cloud-storage",
	documentationUrl: "https://prismatic.io/docs/components/google-cloud-storage/",
	public: true,
	display: {
		label: "Google Cloud Storage",
		description: "Manage files in a Google Cloud Platform (GCP) Cloud Storage bucket",
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
		...multipartUpload,
	},
	hooks: { error: handleErrors },
	connections,
	dataSources,
});
