import type { StorageOptions } from "@google-cloud/storage";
import { util, type Connection, ConnectionError } from "@prismatic-io/spectral";
import { GoogleAuth, OAuth2Client } from "google-auth-library";
import { js2xml, xml2json } from "xml-js";
import { googleOAuthConnection, googlePrivateKeyConnection } from "./connections";
import { PART_UPLOAD_ARRAY_ERROR } from "./constants";
import type { Part } from "./interfaces";

export const getStorageOptions = (connection: Connection, isHttp = false): StorageOptions => {
	if (connection.key === googleOAuthConnection.key) {
		if (!connection.token?.access_token) {
			throw new ConnectionError(
				connection,
				"Received valid OAuth Connection type but did not find valid access token.",
			);
		}
		const oauth2Client = new OAuth2Client();
		const token = util.types.toString(connection.token.access_token);
		oauth2Client.setCredentials({
			access_token: token,
		});

		return {
			authClient: oauth2Client,
		};
	}
	if (connection.key === googlePrivateKeyConnection.key) {
		const clientEmail = util.types.toString(connection.fields.clientEmail);
		const privateKey = util.types.toString(connection.fields.privateKey).replace(/\\n/g, "\n");

		const googleAuth = new GoogleAuth({
			credentials: {
				client_email: clientEmail,
				private_key: privateKey,
			},
			scopes: ["https://www.googleapis.com/auth/devstorage.read_write"],
		});

		if (isHttp) {
			return {
				authClient: googleAuth,
			};
		}
		return {
			credentials: {
				client_email: clientEmail,
				private_key: privateKey,
			},
		};
	}
	throw new ConnectionError(connection, "Unknown Connection type provided.");
};

export const validateConnection = (connection: Connection) => {
	if (![googleOAuthConnection.key, googlePrivateKeyConnection.key].includes(connection.key)) {
		throw new ConnectionError(connection, "Unknown Connection type provided.");
	}
};

export const getProjectId = (connection: Connection): string => {
	return util.types.toString(connection.fields.projectId);
};

export const convertXMLToJSON = (xml: string) => {
	return util.types.toObject(
		xml2json(xml, {
			compact: true,
			spaces: 0,
		}),
	);
};

export const convertJSObjectToXML = (jsObjec: Record<string, unknown>) => {
	return js2xml(jsObjec, {
		compact: true,
		spaces: 2,
	});
};

export const toOptionalNumber = (value: unknown) =>
	value ? util.types.toNumber(value) : undefined;

export const cleanUploads = (value: unknown): Part[] => {
	const uploads = util.types.toObject(value);
	if (Array.isArray(uploads)) {
		for (const upload of uploads) {
			const keys = Object.keys(upload);
			if (keys.length === 2 && keys.includes("PartNumber") && keys.includes("ETag")) {
				continue;
			}
			throw new Error(PART_UPLOAD_ARRAY_ERROR);
		}
		return uploads;
	}
	throw new Error(PART_UPLOAD_ARRAY_ERROR);
};

export const toOptionalString = (value: unknown) => {
	return value ? util.types.toString(value) : undefined;
};

export const paginateGCSResults = async <T>(
	fetchFunction: (params: {
		maxResults?: number;
		pageToken?: string;
	}) => Promise<[T[], { pageToken?: string }, unknown]>,
	fetchAll: boolean,
	params: {
		maxResults?: number;
		pageToken?: string;
	},
): Promise<{ items: T[]; nextPageToken?: string }> => {
	const [firstPageItems, firstPageQuery] = await fetchFunction(params);

	if (!fetchAll) {
		return {
			items: firstPageItems,
			nextPageToken: firstPageQuery?.pageToken,
		};
	}

	let allItems: T[] = firstPageItems;
	let nextPageToken = firstPageQuery?.pageToken;

	while (nextPageToken) {
		const [nextPageItems, nextPageQuery] = await fetchFunction({
			...params,
			pageToken: nextPageToken,
		});

		if (nextPageItems.length === 0) break;

		allItems = allItems.concat(nextPageItems);
		nextPageToken = nextPageQuery?.pageToken;
	}

	return {
		items: allItems,
		nextPageToken: undefined,
	};
};

export const sortAlphabetically = (a: { name: string }, b: { name: string }) => {
	return a.name < b.name ? -1 : 1;
};
