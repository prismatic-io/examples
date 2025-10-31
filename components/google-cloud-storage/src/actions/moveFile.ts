import type { File } from "@google-cloud/storage";
import { util, action } from "@prismatic-io/spectral";
import { googleStorageClient } from "../client";
import { moveFileExamplePayload } from "../examplePayloads";
import {
	connectionInput,
	destinationBucketName,
	destinationFileName,
	sourceBucketName,
	sourceFileName,
} from "../inputs";

export const moveFile = action({
	display: {
		label: "Move File",
		description: "Move a file from one Google Cloud Storage bucket to another",
	},
	inputs: {
		sourceBucketName,
		destinationBucketName,
		sourceFileName,
		destinationFileName,
		connection: connectionInput,
	},
	perform: async (
		_context,
		{ sourceBucketName, destinationBucketName, sourceFileName, destinationFileName, connection },
	) => {
		const storage = googleStorageClient(connection);
		const [file] = (await storage
			.bucket(util.types.toString(sourceBucketName))
			.file(util.types.toString(sourceFileName))
			.move(
				storage
					.bucket(util.types.toString(destinationBucketName))
					.file(util.types.toString(destinationFileName)),
			)) as unknown as [File];

		const [metadata] = await file.getMetadata();
		return { data: metadata as typeof moveFileExamplePayload.data };
	},
	examplePayload: moveFileExamplePayload,
});
