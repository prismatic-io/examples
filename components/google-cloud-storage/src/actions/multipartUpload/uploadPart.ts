import { action } from "@prismatic-io/spectral";
import { googleHttpClient } from "../../client";
import { uploadPartExamplePayload } from "../../examplePayloads";
import {
	connectionInput,
	destinationBucketName,
	fileContents,
	fileName,
	partNumber,
	uploadId,
} from "../../inputs";

export const uploadPartOfAMultipartUpload = action({
	display: {
		label: "Upload Part of a Multipart Upload",
		description: "Upload a part of a multipart upload to Google Cloud Storage",
	},
	inputs: {
		uploadId,
		fileName,
		fileContents,
		partNumber,
		destinationBucketName,
		connection: connectionInput,
	},
	perform: async (
		context,
		{ destinationBucketName, connection, fileName, fileContents, uploadId, partNumber },
	) => {
		const client = await googleHttpClient(connection, destinationBucketName, context.debug.enabled);
		const { data: fileData, contentType } = fileContents;
		const { headers } = await client.put(fileName, fileData, {
			headers: {
				"Content-Type": contentType,
			},
			params: {
				uploadId,
				partNumber,
			},
		});

		const etag = headers.etag;

		return {
			data: {
				PartNumber: partNumber,
				ETag: etag.replace(/"/g, ""),
			},
		};
	},
	examplePayload: uploadPartExamplePayload,
});
