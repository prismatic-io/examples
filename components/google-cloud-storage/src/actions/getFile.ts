import { util, action } from "@prismatic-io/spectral";
import { googleStorageClient } from "../client";
import { bucketName, connectionInput, fileName } from "../inputs";

export const getFile = action({
	display: {
		label: "Get File",
		description: "Get the information and metadata of a file from Google Cloud Storage",
	},
	inputs: { fileName, bucketName, connection: connectionInput },
	perform: async (_context, { bucketName, fileName, connection }) => {
		const storage = googleStorageClient(connection);
		const [metadata] = await storage
			.bucket(util.types.toString(bucketName))
			.file(util.types.toString(fileName))
			.getMetadata();

		return {
			data: metadata,
			contentType: metadata.contentType,
		};
	},
	examplePayload: {
		data: {
			kind: "storage#object",
			id: "bucket-name/file-name.txt/1234567890123456",
			name: "file-name.txt",
			bucket: "bucket-name",
			generation: "1234567890123456",
			metageneration: "1",
			contentType: "text/plain",
			timeCreated: "2021-01-01T00:00:00.000Z",
			updated: "2021-01-01T00:00:00.000Z",
			storageClass: "STANDARD",
			timeStorageClassUpdated: "2021-01-01T00:00:00.000Z",
			size: "1234",
			md5Hash: "abc123==",
			mediaLink: "https://storage.googleapis.com/download/storage/v1/b/bucket-name/o/file-name.txt",
			crc32c: "abc123==",
			etag: "abc123==",
		},
		contentType: "text/plain",
	},
});
