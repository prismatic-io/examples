import { util, action } from "@prismatic-io/spectral";
import { googleStorageClient } from "../client";
import { deleteBucketExamplePayload } from "../examplePayloads";
import { bucketName, connectionInput } from "../inputs";

export const deleteBucket = action({
	display: {
		label: "Delete Bucket",
		description: "Delete an existing Bucket from the Google Cloud Storage",
	},
	inputs: { bucketName, connection: connectionInput },
	perform: async (_context, { bucketName, connection }) => {
		const storage = googleStorageClient(connection);
		const data = await storage.bucket(util.types.toString(bucketName)).delete();

		return { data: JSON.parse(JSON.stringify(data)) };
	},
	examplePayload: deleteBucketExamplePayload,
});
