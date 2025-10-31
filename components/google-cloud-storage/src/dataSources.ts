import type { Bucket, File } from "@google-cloud/storage";
import { dataSource } from "@prismatic-io/spectral";
import { googleStorageClient } from "./client";
import { selectBucketExamplePayload, selectFileExamplePayload } from "./examplePayloads";
import { selectBucketInputs, selectFileInputs } from "./inputs";
import { paginateGCSResults, sortAlphabetically } from "./util";

export const selectBucket = dataSource({
	display: {
		label: "Select Bucket",
		description: "Select a Google Cloud Storage bucket from a dropdown menu",
	},
	inputs: selectBucketInputs,
	dataSourceType: "picklist",
	perform: async (_context, params) => {
		const storage = googleStorageClient(params.connection);

		const result = await paginateGCSResults<Bucket>(
			async ({ maxResults, pageToken }) => storage.getBuckets({ maxResults, pageToken }),
			true,
			{},
		);
		return {
			result: result.items.sort(sortAlphabetically).map<string>((bucket) => bucket.name),
		};
	},
	examplePayload: selectBucketExamplePayload,
});

export const selectFile = dataSource({
	display: {
		label: "Select File",
		description: "Select a file from a Google Cloud Storage bucket",
	},
	inputs: selectFileInputs,
	dataSourceType: "picklist",
	perform: async (_context, params) => {
		const storage = googleStorageClient(params.connection);
		const bucket = storage.bucket(params.bucketName);
		const prefixValue = params.prefix;

		const result = await paginateGCSResults<File>(
			async ({ maxResults, pageToken }) =>
				bucket.getFiles({
					prefix: prefixValue,
					maxResults,
					pageToken,
				}),
			true,
			{},
		);
		return {
			result: result.items.sort(sortAlphabetically).map<string>((file) => file.name),
		};
	},
	examplePayload: selectFileExamplePayload,
});

export default { selectBucket, selectFile };
