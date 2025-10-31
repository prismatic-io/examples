import type { Bucket } from "@google-cloud/storage";
import { action } from "@prismatic-io/spectral";
import { googleStorageClient } from "../client";
import { listBucketsExamplePayload } from "../examplePayloads";
import { listBucketsInputs } from "../inputs";
import { paginateGCSResults } from "../util";

export const listBuckets = action({
	display: {
		label: "List Buckets",
		description: "List buckets in a Google Cloud Storage project",
	},
	inputs: listBucketsInputs,
	perform: async (_context, { connection, fetchAll }) => {
		const storage = googleStorageClient(connection);

		const result = await paginateGCSResults<Bucket>(
			async ({ maxResults, pageToken }) => storage.getBuckets({ maxResults, pageToken }),
			fetchAll,
			{},
		);

		return {
			data: JSON.parse(JSON.stringify(result.items)),
		};
	},
	examplePayload: listBucketsExamplePayload,
});
