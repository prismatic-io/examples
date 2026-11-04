# Large File Transfer

This integration demonstrates how to move a file of any size between two systems without any single execution holding the whole file in memory. It uses the `batchFlowTrigger` pattern to split the file into byte ranges, transfers one range per batch execution, and reassembles the file on the destination with a resumable upload session. It showcases planning work in a batch trigger, bounding memory per execution with `batchSize: 1`, ordered batch processing with `concurrentBatchLimit: 1`, and verifying a chunked copy against a content hash. Both ends are Dropbox folders so the example runs on its own, but the pattern applies to any source that supports HTTP range requests and any destination that supports multipart or resumable uploads.

## What this integration does

The **Transfer File** flow picks up the oldest file in a source folder (or a file named in the request body), copies it to a destination folder in chunks of a configurable size (40 MB by default), verifies that the copy matches the original, and moves the original to an archive folder.

Memory per execution is bounded by the chunk size, not the file size. With debug mode enabled, each batch records resident memory before and after its download. In test runs with a 350 MB file, the download added roughly two to three times the chunk size to resident memory: about 85 MB per batch at the default 40 MB, and 200 to 300 MB per batch at 100 MB. A file ten times larger produces the same per-execution footprint, because no execution ever holds more than one chunk.

The runtime container's own high-water mark is less sensitive to this setting, because Node does not return freed memory to the operating system right away. In these runs it stayed within the runner's default 1 GB allocation at both chunk sizes. Raise **Chunk Size (MB)** for fewer, larger batches, or lower it for more headroom.

A second flow, **Generate Test File**, writes a zip of random data to the source folder so you can try the transfer without uploading a large file by hand.

The request body is optional. To transfer a specific file instead of the oldest one, send:

```json
{
  "path": "/Large File Transfer/source/export.zip"
}
```

## Key features

### Chunk planning in the trigger

`onTrigger` reads the file's size, revision, and content hash, opens an upload session, and returns one item per byte range:

```typescript
const items: FileChunk[] = plan.map((range) => ({
  ...range, // chunkIndex, offset, length, isLast
  totalChunks: plan.length,
  sourcePath,
  sourceRev: metadata.rev,
  sourceSize: metadata.size,
  sourceContentHash: metadata.content_hash,
  sessionId,
  destinationPath,
  archivePath,
}));
```

Each item is a few hundred bytes of metadata. No file content passes through the trigger or the batch payload.

### Ordered single-chunk batches

```typescript
batchConfig: { batchSize: 1, concurrentBatchLimit: 1 },
```

- **`batchSize: 1`** - `onExecution` receives exactly one chunk per execution, so memory per execution is bounded by the chunk size rather than the file size.
- **`concurrentBatchLimit: 1`** - the platform runs one batch at a time, first in, first out. A sequential upload session requires ranges to arrive in order, so this setting is what makes the reassembly correct.

With `batchSize: 1` the platform delivers `params.onTrigger.results.body.data` as a single object rather than an array; `onExecution` handles both shapes.

### Range downloads and session appends

Each batch requests a temporary link for the source file and downloads only its range:

```typescript
const response = await fetch(temporary.link, {
  headers: { Range: `bytes=${chunk.offset}-${end}` },
});
```

It checks that the file's revision and size still match the plan, that the server answered `206 Partial Content`, and that the byte count is exact. It then appends the bytes to the upload session at the same offset, with a content hash so Dropbox rejects anything corrupted in transit.

### Integrity verification

The batch that handles the final chunk commits the upload session and compares the assembled file's `content_hash` and size against the source. The original is moved to the archive folder only after that check passes.

### Replay safety

If a batch fails, the execution fails and the file is not committed. Individual batches cannot be replayed, so recovery is to replay the whole execution, which runs the trigger again and plans the transfer from scratch. That is safe because the copy is written with overwrite mode and the original is only archived after verification. The append and commit helpers also tolerate being called again after Dropbox already applied a request.

## Integration structure

Beyond the standard integration files, this integration contains the following key files:

- [src/flows.ts](src/flows.ts) - The **Transfer File** flow: the `batchFlowTrigger` that plans chunks and the `onExecution` function that transfers one chunk and finalizes the copy on the last one.
- [src/dropboxTransfer.ts](src/dropboxTransfer.ts) - Chunk planning, the Dropbox content hash algorithm, range downloads, and a small client for Dropbox's upload session endpoints.
- [src/generateTestFile.ts](src/generateTestFile.ts) - The **Generate Test File** flow, with [src/zipBuilder.ts](src/zipBuilder.ts) providing a minimal zip writer.
- [src/configPages.ts](src/configPages.ts) - The Dropbox OAuth connection and folder and chunk size settings.
- [src/manifests/dropbox](src/manifests/dropbox) - The generated manifest for the Dropbox component.

## Flow details

### Transfer File Flow

The [flows.ts](src/flows.ts) flow demonstrates the chunked transfer pattern end to end. This flow:

1. `onTrigger` creates the source, destination, and archive folders if needed and picks the oldest file in the source folder (or the `path` from the request body).
2. It computes the chunk plan from **Chunk Size (MB)** and opens one upload session.
3. It returns one item per chunk in a single discovery round.
4. `onExecution` runs once per chunk: download the range, append it to the session, return a short summary.
5. The execution for the final chunk commits the session, verifies size and content hash, and moves the original to the archive folder.

### Generate Test File Flow

Writes a valid zip containing one uncompressed entry of random bytes to the source folder, streamed through an upload session 64 MiB at a time. Random data does not compress, so the file behaves like a real large export. The request body accepts `{ "sizeMb": 350, "fileName": "test.zip" }`; the default is 350 MB and the maximum is 3000 MB.

## Testing the integration

### Configure Dropbox credentials

Create a Dropbox app following the [Dropbox component's connection docs](https://prismatic.io/docs/components/dropbox/#oauth): choose **Scoped access**, grant the `files.metadata.read`, `files.metadata.write`, `files.content.read`, and `files.content.write` permissions, and add Prismatic's OAuth callback URL as a redirect URI. With **App folder** access, this integration's folder paths are relative to the app's folder.

Copy `.env.example` to `.env` and fill in the app key and secret. They are read at build time and become the connection's client ID and secret.

### Running in Prismatic

To run the integration in Prismatic, first build and import the integration:

```bash
npm run build
prism integrations:import --open
```

Then:

1. Configure a test instance. Click **Connect** on the Dropbox connection and complete the OAuth flow. The folder defaults can stay as they are.
2. Run **Generate Test File**. It writes a 350 MB zip to the source folder and logs its content hash.
3. Run **Transfer File** with an empty request body. You should see nine processing batches, one per 40 MB chunk. The last batch logs the verified content hash and the archive path.

Enable debug mode on the test run to record memory usage before and after each chunk download in the execution's debug metrics.

### Running unit tests

```bash
npm run test
```

The tests cover chunk planning, chunk size alignment, the content hash algorithm, and the zip structures. They do not call Dropbox.

## Extending this integration

This integration provides a foundation that can be extended in several ways:

### Using a different source

The source needs to report the file's size and honor HTTP `Range` requests, which Amazon S3, Azure Blob Storage, and Google Cloud Storage all do.

1. Replace `readMetadata` and `findOldestFile` in [src/dropboxTransfer.ts](src/dropboxTransfer.ts) with calls that return the file's size, a revision or ETag, and a path
2. Replace `downloadRange` with a range request against your source, keeping the checks on status code and byte count
3. Add a connection for the source in [src/configPages.ts](src/configPages.ts)

### Using a different destination

Any resumable or multipart upload API fits the same three calls, including S3 multipart uploads, Microsoft Graph upload sessions for OneDrive and SharePoint, and Google Cloud Storage resumable uploads.

1. Replace `startUploadSession`, `appendChunk`, and `finishUploadSession` with the destination's start, upload-part, and complete calls
2. Adjust `resolveChunkBytes` to the destination's part size rules. Microsoft Graph, for example, requires each request to be under 60 MiB and sized in 320 KiB multiples, which the default 40 MB already satisfies alongside the 4 MB alignment used here for Dropbox
3. Keep `concurrentBatchLimit: 1` unless the destination accepts out-of-order parts

### Transferring several files per run

1. Return items for every file in the source folder from `onTrigger`, or page through the listing with `paginationState`
2. Open one upload session per file and carry its ID on that file's items
3. Commit each file from the item marked `isLast` for that file
