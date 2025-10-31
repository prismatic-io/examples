import { util, action } from "@prismatic-io/spectral";
import { googleStorageClient } from "../client";
import { downloadFileExamplePayload } from "../examplePayloads";
import { bucketName, connectionInput, fileName } from "../inputs";

export const downloadFile = action({
	display: {
		label: "Download File",
		description: "Download a file from Google Cloud Storage",
	},
	inputs: { fileName, bucketName, connection: connectionInput },
	perform: async (_context, { bucketName, fileName, connection }) => {
		const storage = googleStorageClient(connection);
		const [metadata] = await storage
			.bucket(util.types.toString(bucketName))
			.file(util.types.toString(fileName))
			.getMetadata();
		const [contents] = await storage
			.bucket(util.types.toString(bucketName))
			.file(util.types.toString(fileName))
			.download();
		return {
			data: contents.toString("base64"),
			contentType: metadata.contentType,
		};
	},
	examplePayload: downloadFileExamplePayload,
});
