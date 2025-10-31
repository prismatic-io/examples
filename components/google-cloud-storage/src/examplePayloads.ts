/**
 * Example payloads for Google Cloud Storage actions
 * Based on Google Cloud Storage JSON API v1 response structures
 * Reference: https://cloud.google.com/storage/docs/json_api/v1
 */

// ============================================================================
// FILE/OBJECT PAYLOADS
// ============================================================================

/**
 * Complete file metadata object
 * Used by: Get File, Save File (when fileMetadata=true)
 */
export const getFileExamplePayload = {
	data: {
		kind: "storage#object",
		id: "my-gcs-bucket/documents/report-2024.pdf/1705324800000000",
		selfLink: "https://www.googleapis.com/storage/v1/b/my-gcs-bucket/o/documents%2Freport-2024.pdf",
		mediaLink:
			"https://storage.googleapis.com/download/storage/v1/b/my-gcs-bucket/o/documents%2Freport-2024.pdf?generation=1705324800000000&alt=media",
		name: "documents/report-2024.pdf",
		bucket: "my-gcs-bucket",
		generation: "1705324800000000",
		metageneration: "1",
		contentType: "application/pdf",
		storageClass: "STANDARD",
		size: "2457600",
		md5Hash: "5d8eb89ce5dc25d54896006b6583eaa0",
		crc32c: "xgdNfQ==",
		etag: "CODg8PPX5oQDEAE=",
		timeCreated: "2024-01-15T10:00:00.000Z",
		updated: "2024-01-15T10:00:00.000Z",
		timeStorageClassUpdated: "2024-01-15T10:00:00.000Z",
		contentEncoding: null,
		contentDisposition: null,
		contentLanguage: null,
		cacheControl: null,
		metadata: null,
		temporaryHold: false,
		eventBasedHold: false,
	},
};

/**
 * Save file success message (when fileMetadata=false)
 */
export const saveFileSimpleExamplePayload = {
	data: "File saved successfully!",
};

/**
 * Save file with metadata (when fileMetadata=true)
 * Reuses getFileExamplePayload structure
 */
export const saveFileWithMetadataExamplePayload = getFileExamplePayload;

/**
 * Delete file response
 */
export const deleteFileExamplePayload = {
	data: null,
};

/**
 * Copy file response - returns destination file metadata
 */
export const copyFileExamplePayload = {
	data: {
		kind: "storage#object",
		id: "my-destination-bucket/documents/report-2024-copy.pdf/1705411200000000",
		selfLink:
			"https://www.googleapis.com/storage/v1/b/my-destination-bucket/o/documents%2Freport-2024-copy.pdf",
		mediaLink:
			"https://storage.googleapis.com/download/storage/v1/b/my-destination-bucket/o/documents%2Freport-2024-copy.pdf?generation=1705411200000000&alt=media",
		name: "documents/report-2024-copy.pdf",
		bucket: "my-destination-bucket",
		generation: "1705411200000000",
		metageneration: "1",
		contentType: "application/pdf",
		storageClass: "STANDARD",
		size: "2457600",
		md5Hash: "5d8eb89ce5dc25d54896006b6583eaa0",
		crc32c: "xgdNfQ==",
		etag: "CODg8PPX5oQDEAE=",
		timeCreated: "2024-01-16T10:00:00.000Z",
		updated: "2024-01-16T10:00:00.000Z",
		timeStorageClassUpdated: "2024-01-16T10:00:00.000Z",
		contentEncoding: null,
		contentDisposition: null,
		contentLanguage: null,
		cacheControl: null,
		metadata: null,
		temporaryHold: false,
		eventBasedHold: false,
	},
};

/**
 * Move file response - returns destination file metadata
 * Structure identical to copy (move = copy + delete)
 */
export const moveFileExamplePayload = copyFileExamplePayload;

/**
 * Download file response
 */
export const downloadFileExamplePayload = {
	data: "base64EncodedFileContent==",
	contentType: "application/pdf",
};

/**
 * Generate presigned URL response
 */
export const generatePresignedUrlExamplePayload = {
	data: "https://storage.googleapis.com/my-gcs-bucket/documents/upload-file.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=service-account%40project-123456.iam.gserviceaccount.com%2F20240116%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240116T100000Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=content-type%3Bhost&X-Goog-Signature=abcdef123456",
};

/**
 * List files response
 */
export const listFilesExamplePayload = {
	data: {
		files: [
			"documents/report-2024.pdf",
			"documents/presentation-q1.pptx",
			"documents/spreadsheet-data.xlsx",
			"images/logo.png",
			"images/banner.jpg",
		],
		pagination: {
			pageToken: "bXkvbGFzdC9wcm9jZXNzZWQvZmlsZS50eHQ=",
			maxResults: 20,
			prefix: "documents/",
		},
	},
};

// ============================================================================
// BUCKET PAYLOADS
// ============================================================================

/**
 * Complete bucket metadata object
 * Used by: Get Bucket, Create Bucket
 */
export const getBucketExamplePayload = {
	data: [
		{
			kind: "storage#bucket",
			id: "my-gcs-bucket",
			selfLink: "https://www.googleapis.com/storage/v1/b/my-gcs-bucket",
			projectNumber: "123456789012",
			name: "my-gcs-bucket",
			timeCreated: "2024-01-10T08:00:00.000Z",
			updated: "2024-01-15T14:30:00.000Z",
			metageneration: "3",
			location: "US-EAST1",
			locationType: "region",
			storageClass: "STANDARD",
			etag: "CAM=",
			iamConfiguration: {
				bucketPolicyOnly: {
					enabled: false,
				},
				uniformBucketLevelAccess: {
					enabled: false,
				},
				publicAccessPrevention: "inherited",
			},
			versioning: {
				enabled: false,
			},
			labels: null,
			lifecycle: {
				rule: [],
			},
			cors: [],
			encryption: null,
			logging: null,
			website: null,
			billing: null,
			retentionPolicy: null,
			defaultEventBasedHold: false,
		},
	],
};

/**
 * Create bucket response
 * Reuses getBucketExamplePayload structure
 */
export const createBucketExamplePayload = getBucketExamplePayload;

/**
 * Delete bucket response
 */
export const deleteBucketExamplePayload = {
	data: null,
};

/**
 * List buckets response
 */
export const listBucketsExamplePayload = {
	data: [
		{
			kind: "storage#bucket",
			id: "my-gcs-bucket",
			selfLink: "https://www.googleapis.com/storage/v1/b/my-gcs-bucket",
			projectNumber: "123456789012",
			name: "my-gcs-bucket",
			timeCreated: "2024-01-10T08:00:00.000Z",
			updated: "2024-01-15T14:30:00.000Z",
			metageneration: "3",
			location: "US-EAST1",
			locationType: "region",
			storageClass: "STANDARD",
			etag: "CAM=",
		},
		{
			kind: "storage#bucket",
			id: "project-backups",
			selfLink: "https://www.googleapis.com/storage/v1/b/project-backups",
			projectNumber: "123456789012",
			name: "project-backups",
			timeCreated: "2024-01-05T12:00:00.000Z",
			updated: "2024-01-10T09:15:00.000Z",
			metageneration: "1",
			location: "US",
			locationType: "multi-region",
			storageClass: "NEARLINE",
			etag: "CAE=",
		},
		{
			kind: "storage#bucket",
			id: "user-uploads",
			selfLink: "https://www.googleapis.com/storage/v1/b/user-uploads",
			projectNumber: "123456789012",
			name: "user-uploads",
			timeCreated: "2023-12-20T10:00:00.000Z",
			updated: "2024-01-12T16:45:00.000Z",
			metageneration: "5",
			location: "US-WEST1",
			locationType: "region",
			storageClass: "STANDARD",
			etag: "CAU=",
		},
	],
};

// ============================================================================
// MULTIPART UPLOAD PAYLOADS
// ============================================================================

/**
 * Create multipart upload response (XML parsed to JSON)
 */
export const createMultipartUploadExamplePayload = {
	data: {
		InitiateMultipartUploadResult: {
			Bucket: {
				_text: "my-gcs-bucket",
			},
			Key: {
				_text: "uploads/large-video.mp4",
			},
			UploadId: {
				_text: "ABPnzm5uCe3g2XLS5kkxHPDZYrE68x87DhmcnJM1kKZ8ECXTtWCtJYHATzeych__ZDfWWN8",
			},
		},
	},
};

/**
 * Upload part response
 */
export const uploadPartExamplePayload = {
	data: {
		PartNumber: 1,
		ETag: "5fbd6b4faa5393f343d276457f3f7d9f",
	},
};

/**
 * Complete multipart upload response (XML parsed to JSON)
 */
export const completeMultipartUploadExamplePayload = {
	data: {
		CompleteMultipartUploadResult: {
			Location: {
				_text: "https://storage.googleapis.com/my-gcs-bucket/uploads/large-video.mp4",
			},
			Bucket: {
				_text: "my-gcs-bucket",
			},
			Key: {
				_text: "uploads/large-video.mp4",
			},
			ETag: {
				_text: '"a2a6ca083c7e6d13893dc34c6daf43f6-7"',
			},
		},
	},
};

// ============================================================================
// RAW REQUEST PAYLOAD
// ============================================================================

/**
 * Raw request response (generic API response)
 */
export const rawRequestExamplePayload = {
	data: {
		kind: "storage#object",
		id: "my-gcs-bucket/path/to/file.txt/1705324800000000",
		name: "path/to/file.txt",
		bucket: "my-gcs-bucket",
		generation: "1705324800000000",
		metageneration: "1",
		contentType: "text/plain",
		storageClass: "STANDARD",
		size: "1024",
		timeCreated: "2024-01-15T10:00:00.000Z",
		updated: "2024-01-15T10:00:00.000Z",
	},
};

// ============================================================================
// DATA SOURCE PAYLOADS (for inline data sources)
// ============================================================================

/**
 * Select file data source response
 */
export const selectFileExamplePayload = {
	result: ["documents/report-2024.pdf", "images/logo.png", "data/export-2024-01.csv"],
};

/**
 * Select bucket data source response
 */
export const selectBucketExamplePayload = {
	result: ["my-gcs-bucket", "project-backups", "user-uploads"],
};
