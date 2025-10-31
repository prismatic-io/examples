import { util, action } from "@prismatic-io/spectral";
import { googleStorageClient } from "../client";
import { deleteFileExamplePayload } from "../examplePayloads";
import { bucketName, connectionInput, fileName } from "../inputs";

export const deleteFile = action({
	display: {
		label: "Delete File",
		description: "Delete a file from a Google Cloud Storage bucket",
	},
	inputs: { fileName, bucketName, connection: connectionInput },
	perform: async (_context, { bucketName, fileName, connection }) => {
		const storage = googleStorageClient(connection);
		await storage
			.bucket(util.types.toString(bucketName))
			.file(util.types.toString(fileName))
			.delete();

		return { data: null };
	},
	examplePayload: deleteFileExamplePayload,
});
