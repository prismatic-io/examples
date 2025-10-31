import { util, input } from "@prismatic-io/spectral";
import { inputs as httpClientInputs } from "@prismatic-io/spectral/dist/clients/http";
import { completeMultipartUploadExampleInput } from "./exampleInputs";
import { cleanUploads, toOptionalNumber, toOptionalString } from "./util";

export const project = input({
	label: "GCP Project ID",
	placeholder: "Enter GCP Project ID",
	type: "string",
	required: true,
	comments:
		"Google Cloud Storage buckets are associated with GCP projects. This is the project ID containing letters, numbers, and dashes.",
	example: "my-project-123456",
});

export const bucketName = input({
	label: "Bucket Name",
	placeholder: "Enter bucket name",
	type: "string",
	required: true,
	comments:
		"The name of the Google Cloud Storage bucket. Bucket names contain only lowercase letters, numbers, hyphens, and underscores.",
	example: "my-gcs-bucket",
	dataSource: "selectBucket",
	clean: util.types.toString,
});

export const sourceBucketName = input({
	label: "Source Bucket",
	placeholder: "Enter source bucket name",
	type: "string",
	required: true,
	comments:
		"The name of the bucket containing the file to copy. When copying files within a single bucket, use the same bucket name for both source and destination.",
	example: "my-source-bucket",
	dataSource: "selectBucket",
	clean: util.types.toString,
});

export const destinationBucketName = input({
	label: "Destination Bucket",
	placeholder: "Enter destination bucket name",
	type: "string",
	required: true,
	comments:
		"The name of the bucket where the file will be copied. When copying files within a single bucket, use the same bucket name for both source and destination.",
	example: "my-destination-bucket",
	dataSource: "selectBucket",
	clean: util.types.toString,
});

export const fileContents = input({
	label: "File Contents",
	placeholder: "Output data from previous step, or a string, to write",
	type: "data",
	required: true,
	comments:
		"The contents to write to a file. This can be a string of text, it can be binary data (like an image or PDF) that was generated in a previous step.",
	example: "My File Contents",
	clean: util.types.toData,
});

export const fileName = input({
	label: "File Name",
	placeholder: "Enter file name",
	type: "string",
	required: true,
	comments: "The file path within the bucket. Do not include a leading slash.",
	example: "path/to/file.txt",
	dataSource: "selectFile",
	clean: util.types.toString,
});

export const partNumber = input({
	label: "Part Number",
	type: "string",
	required: true,
	comments:
		"The position of this part within the multipart upload. Must be an integer between 1 and 10,000.",
	example: "1",
	placeholder: "Enter part number",
	clean: util.types.toNumber,
});

export const sourceFileName = input({
	label: "Source File Name",
	placeholder: "Enter source file name",
	type: "string",
	required: true,
	comments: "The source file path within the bucket. Do not include a leading slash.",
	example: "path/to/source/file.txt",
	dataSource: "selectFile",
	clean: util.types.toString,
});

export const destinationFileName = input({
	label: "Destination File Name",
	placeholder: "Enter destination file name",
	type: "string",
	required: true,
	comments: "The destination file path within the bucket. Do not include a leading slash.",
	example: "path/to/destination/file.txt",
	dataSource: "selectFile",
	clean: util.types.toString,
});

export const uploadId = input({
	label: "Upload ID",
	type: "string",
	required: true,
	comments:
		"The unique identifier for the multipart upload. This value is returned when the multipart upload is initiated.",
	example: "VXBsb2FkIElEIGZvciBlbHZpbmcncyBteS1tb3ZpZS5tMnRzIHVwbG9hZA",
	placeholder: "Enter upload ID",
	clean: util.types.toString,
});

export const contentType = input({
	label: "Content Type",
	type: "string",
	required: true,
	comments: "The MIME type of the file (e.g., image/png, application/pdf, text/plain).",
	example: "image/png",
	placeholder: "Enter content type",
	clean: util.types.toString,
});

export const prefix = input({
	label: "Prefix",
	placeholder: "Enter prefix",
	type: "string",
	required: false,
	comments:
		"Filter results to only files with names starting with this prefix. For example, 'unprocessed/' returns only files in that directory. Leave blank to list all files.",
	example: "path/to/directory/",
	clean: toOptionalString,
});

export const maxResults = input({
	label: "Max Results",
	type: "string",
	required: false,
	comments: "The maximum number of results to return per page. Must be between 1 and 50.",
	example: "20",
	placeholder: "Enter max results",
	clean: toOptionalNumber,
});

export const pageToken = input({
	label: "Page Token",
	type: "string",
	required: false,
	comments:
		"The pagination token returned by a previous request. Use this to retrieve the next page of results.",
	example: "bXkvbGFzdC9wcm9jZXNzZWQvZmlsZS50eHQ",
	placeholder: "Enter page token",
	clean: toOptionalString,
});

export const connectionInput = input({
	label: "Connection",
	type: "connection",
	required: true,
});

export const userProject = input({
	label: "User Project",
	type: "string",
	required: false,
	comments: "The project ID that the user creating the bucket belongs to.",
	example: "my-example-project",
	placeholder: "Enter user project ID",
});

export const location = input({
	label: "Location",
	type: "string",
	required: false,
	comments:
		"The geographic location where the bucket will be created. Defaults to 'US'. See https://cloud.google.com/storage/docs/locations for available locations.",
	example: "US-EAST1",
	placeholder: "Enter location",
});

export const multiRegional = input({
	label: "Multi-Regional",
	type: "boolean",
	required: false,
	comments: "When true, the bucket will be available from multiple regions.",
});

export const storageClass = input({
	label: "Storage Class",
	type: "string",
	required: true,
	model: [
		{ label: "Standard", value: "standard" },
		{ label: "Archived", value: "archived" },
		{ label: "Coldline", value: "coldline" },
		{ label: "Nearline", value: "nearline" },
		{ label: "Regional", value: "regional" },
	],
	comments:
		"The storage class for the bucket. See https://cloud.google.com/storage/docs/storage-classes for details.",
	placeholder: "Select storage class",
});

export const expirationTime = input({
	label: "Expiration Time",
	type: "string",
	required: false,
	comments: "The expiration time for the presigned URL in seconds. Defaults to 3600 (1 hour).",
	example: "3600",
	default: "3600",
	placeholder: "Enter expiration time in seconds",
	clean: (value) => util.types.toInt(value, 3600),
});

export const fileMetadata = input({
	label: "File Metadata",
	type: "boolean",
	required: false,
	comments:
		"When true, returns the file metadata after saving. Read access to the bucket is required.",
	default: "true",
	clean: util.types.toBool,
});

export const partUploads = input({
	label: "Part Uploads",
	type: "code",
	language: "json",
	required: true,
	comments:
		"A JSON array of part uploads. Each part must have a partNumber and etag property. <strong>Note:</strong> Parts less than 5 MiB that are not the final part will result in a 400 Bad Request error.",
	example: JSON.stringify([completeMultipartUploadExampleInput], null, 2),
	clean: cleanUploads,
});

export const fetchAll = input({
	label: "Fetch All Results",
	type: "boolean",
	required: false,
	comments: "When true, automatically fetches all pages of results using pagination.",
	default: "false",
	clean: util.types.toBool,
});

export const listBucketsInputs = {
	fetchAll,
	connection: connectionInput,
};

export const listFilesInputs = {
	connection: connectionInput,
	bucketName,
	prefix,
	pageToken,
	maxResults,
	fetchAll,
};

export const selectBucketInputs = {
	connection: connectionInput,
};

export const selectFileInputs = {
	connection: connectionInput,
	bucketName: {
		...bucketName,
		dataSource: undefined,
	},
	prefix,
};

export const { debugRequest: _, ...rawRequestInputs } = httpClientInputs;
