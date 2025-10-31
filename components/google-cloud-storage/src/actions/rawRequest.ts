import { action } from "@prismatic-io/spectral";
import { sendRawRequest } from "@prismatic-io/spectral/dist/clients/http";
import { googleStorageClient } from "../client";
import { rawRequestExamplePayload } from "../examplePayloads";
import { connectionInput, rawRequestInputs } from "../inputs";

const rawRequest = action({
	display: {
		label: "Raw Request",
		description: "Send raw HTTP request to Google Cloud Storage",
	},
	inputs: {
		connection: connectionInput,
		...rawRequestInputs,
		url: {
			...rawRequestInputs.url,
			comments:
				"Input the path only (/storage/v1/b/[BUCKET_NAME]/o/[OBJECT_NAME]), The base URL is already included (https://storage.googleapis.com).",
			example: "/storage/v1/b/[BUCKET_NAME]/o/[OBJECT_NAME]",
		},
	},
	perform: async (context, { connection, ...httpClientInputs }) => {
		const accessToken = await googleStorageClient(connection).authClient.getAccessToken();

		const { data } = await sendRawRequest(
			"https://storage.googleapis.com",
			{
				...httpClientInputs,
				debugRequest: context.debug.enabled,
			},
			{
				Authorization: `Bearer ${accessToken}`,
			},
		);

		return { data };
	},
	examplePayload: rawRequestExamplePayload,
});

export default rawRequest;
