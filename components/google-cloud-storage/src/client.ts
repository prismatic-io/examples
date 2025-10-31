import { Storage } from "@google-cloud/storage";
import type { Connection } from "@prismatic-io/spectral";
import { type HttpClient, createClient } from "@prismatic-io/spectral/dist/clients/http";
import { getProjectId, getStorageOptions, validateConnection } from "./util";

export const googleStorageClient = (connection: Connection) => {
	validateConnection(connection);

	const storageOptions = getStorageOptions(connection);
	const projectId = getProjectId(connection);

	return new Storage({
		...storageOptions,
		projectId,
	});
};

export const googleHttpClient = async (
	connection: Connection,
	bucketName: string,
	debug: boolean,
): Promise<HttpClient> => {
	validateConnection(connection);
	const storageOptions = getStorageOptions(connection, true);
	const token = await storageOptions.authClient.getAccessToken();

	return createClient({
		baseUrl: `https://storage.googleapis.com/${bucketName}`,
		debug,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};
