import type { File } from "@google-cloud/storage";
import { util, action } from "@prismatic-io/spectral";
import { googleStorageClient } from "../client";
import { listFilesExamplePayload } from "../examplePayloads";
import { listFilesInputs } from "../inputs";
import { paginateGCSResults } from "../util";

const listFilesV2 = action({
	display: {
		label: "List Files",
		description: "List files in a Google Cloud Storage bucket",
	},
	inputs: listFilesInputs,
	perform: async (_context, params) => {
		const storage = googleStorageClient(params.connection);
		const bucket = storage.bucket(util.types.toString(params.bucketName));
		const prefixValue = util.types.toString(params.prefix);

		const result = await paginateGCSResults<File>(
			async ({ maxResults, pageToken }) =>
				bucket.getFiles({
					prefix: prefixValue,
					maxResults,
					pageToken,
				}),
			params.fetchAll,
			{
				maxResults: params.maxResults,
				pageToken: params.pageToken,
			},
		);

		return {
			data: {
				files: result.items.map((f) => f.name).filter((f) => !f.endsWith("/")), // Filter out directories; we just care about files
				pagination: {
					pageToken: result.nextPageToken,
					maxResults: params.maxResults,
					prefix: prefixValue,
				},
			},
		};
	},
	examplePayload: listFilesExamplePayload,
});

export default { listFilesV2 };
