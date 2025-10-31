import { action } from "@prismatic-io/spectral";
import { googleHttpClient } from "../../client";
import { createMultipartUploadExamplePayload } from "../../examplePayloads";
import { connectionInput, contentType, destinationBucketName, fileName } from "../../inputs";
import { convertXMLToJSON } from "../../util";

export const createMultipartUpload = action({
	display: {
		label: "Create Multipart Upload",
		description: "Create a multipart upload for a file in Google Cloud Storage",
	},
	inputs: {
		fileName,
		contentType,
		destinationBucketName,
		connection: connectionInput,
	},
	perform: async (context, { destinationBucketName, connection, fileName, contentType }) => {
		const client = await googleHttpClient(connection, destinationBucketName, context.debug.enabled);
		const { data } = await client.post(`${fileName}?uploads`, null, {
			headers: {
				"Content-Length": 0,
				Date: new Date().toUTCString(),
				"Content-Type": contentType,
			},
		});

		return {
			data: convertXMLToJSON(data),
		};
	},
	examplePayload: createMultipartUploadExamplePayload,
});
