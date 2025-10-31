import { util, action } from "@prismatic-io/spectral";
import { googleStorageClient } from "../client";
import {
	saveFileSimpleExamplePayload,
	saveFileWithMetadataExamplePayload,
} from "../examplePayloads";
import { bucketName, connectionInput, fileContents, fileMetadata, fileName } from "../inputs";

export const saveFile = action({
	display: {
		label: "Save File",
		description: "Save a file to Google Cloud Storage",
	},
	inputs: {
		fileContents,
		fileName,
		bucketName,
		fileMetadata,
		connection: connectionInput,
	},
	perform: async (_context, { fileContents, bucketName, fileName, connection, fileMetadata }) => {
		const storage = googleStorageClient(connection);
		const { data } = util.types.toData(fileContents);
		await storage.bucket(bucketName).file(fileName).save(data);

		if (fileMetadata) {
			const [metadata] = await storage.bucket(bucketName).file(fileName).getMetadata();
			return {
				data: metadata as typeof saveFileWithMetadataExamplePayload.data,
			};
		}
		return {
			data: "File saved successfully!" as unknown as typeof saveFileWithMetadataExamplePayload.data,
		};
	},
	examplePayload: saveFileWithMetadataExamplePayload,
});
