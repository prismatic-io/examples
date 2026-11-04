import { batchFlowTrigger, flow } from "@prismatic-io/spectral";
import {
  appendChunk,
  archiveSource,
  downloadRange,
  ensureFolders,
  findOldestFile,
  finishUploadSession,
  FileChunk,
  joinPath,
  normalizeFolder,
  planChunks,
  readMetadata,
  resolveChunkBytes,
  startUploadSession,
} from "./dropboxTransfer";
import { generateTestFile } from "./generateTestFile";

// Optional request body for the Transfer File flow. When omitted, the flow
// transfers the oldest file in the source folder.
interface TransferRequestBody {
  path?: string;
}

export const transferFile = flow({
  name: "Transfer File",
  stableKey: "transfer-file",
  description:
    "Copy the oldest file in the source folder (or a file named in the request body) to the destination folder in byte-range chunks.",

  // One chunk per execution, one execution at a time. Upload sessions require
  // ranges in order, and the platform dispatches batches first in, first out
  // when the concurrency limit is 1. Raising either value would let chunks
  // arrive out of order and break the reassembly.
  batchConfig: { batchSize: 1, concurrentBatchLimit: 1 },

  trigger: batchFlowTrigger<FileChunk, Record<string, unknown>>({
    // The trigger only plans the transfer. It reads the file's metadata, opens
    // an upload session, and returns one item per byte range. No file bytes
    // pass through the trigger or the batch payload.
    onTrigger: async (context, payload) => {
      const body = payload.body.data as TransferRequestBody | undefined;
      const requestedPath = body?.path?.trim();
      const source = normalizeFolder(context.configVars["Source Folder"]);
      const destination = normalizeFolder(
        context.configVars["Destination Folder"],
      );
      const archive = normalizeFolder(context.configVars["Archive Folder"]);
      await ensureFolders(context, [source, destination, archive]);

      // Pick the file to transfer: an explicit path from the request, or the
      // oldest file waiting in the source folder.
      const metadata = requestedPath
        ? await readMetadata(context, requestedPath)
        : await findOldestFile(context, source);

      if (!metadata) {
        context.logger.info(`No file found in ${source}; nothing to transfer.`);
        return {
          items: [],
          paginationState: null,
          response: {
            statusCode: 200,
            contentType: "application/json",
            body: JSON.stringify({ accepted: false, reason: "no file found" }),
          },
        };
      }

      const sourcePath =
        metadata.path_display ?? metadata.path_lower ?? requestedPath;
      if (!sourcePath) {
        throw new Error("Dropbox metadata did not include a path.");
      }

      // Split the file into byte ranges and open one upload session that every
      // batch will append to. The session ID travels with each chunk item.
      const chunkBytes = resolveChunkBytes(
        context.configVars["Chunk Size (MB)"],
      );
      const plan = planChunks(metadata.size, chunkBytes);
      const sessionId = await startUploadSession(context);
      const destinationPath = joinPath(destination, metadata.name);
      const archivePath = joinPath(
        archive,
        `${metadata.rev}--${metadata.name}`,
      );

      const items: FileChunk[] = plan.map((range) => ({
        ...range,
        totalChunks: plan.length,
        sourcePath,
        sourceRev: metadata.rev,
        sourceSize: metadata.size,
        sourceContentHash: metadata.content_hash,
        sessionId,
        destinationPath,
        archivePath,
      }));

      context.logger.info(
        `Planned transfer of ${metadata.name} (${metadata.size} bytes): ${plan.length} chunk(s) of up to ${chunkBytes} bytes.`,
      );

      // All chunks are returned in one discovery round, so no pagination state
      // is needed. For very large files (thousands of chunks) you could page
      // the plan through paginationState instead.
      return {
        items,
        paginationState: null,
        response: {
          statusCode: 202,
          contentType: "application/json",
          body: JSON.stringify({
            accepted: true,
            sourcePath,
            destinationPath,
            sizeBytes: metadata.size,
            chunkBytes,
            chunks: plan.length,
          }),
        },
      };
    },
  }),

  // Runs once per chunk: download the byte range, append it to the upload
  // session at the same offset, and on the final chunk commit and verify.
  onExecution: async (context, params) => {
    // With batchSize 1 the platform delivers a single item rather than an
    // array; normalize both shapes.
    const data = params.onTrigger.results.body.data;
    const chunks = (Array.isArray(data) ? data : [data]).filter(
      (item): item is FileChunk => Boolean(item),
    );
    if (chunks.length !== 1) {
      throw new Error(
        `Expected exactly one chunk per batch (batchSize 1) but received ${chunks.length}.`,
      );
    }
    const chunk = chunks[0];
    const label = `chunk ${chunk.chunkIndex + 1}/${chunk.totalChunks}`;

    // Download only this chunk's byte range, then append it to the session at
    // the same offset. Memory readings are recorded when debug mode is on.
    context.debug.memoryUsage(context, `${label} before download`);
    const bytes = await downloadRange(context, chunk);
    context.debug.memoryUsage(context, `${label} after download`);

    const appendResult = await appendChunk(context, chunk, bytes);
    context.logger.info(
      `${label} (${chunk.length} bytes at offset ${chunk.offset}): ${appendResult}.`,
    );

    if (!chunk.isLast) {
      return {
        data: {
          chunkIndex: chunk.chunkIndex,
          totalChunks: chunk.totalChunks,
          offset: chunk.offset,
          length: chunk.length,
          appendResult,
        },
      };
    }

    // Last chunk: commit the session, then verify the assembled file against
    // the source before touching the original.
    const finished = await finishUploadSession(
      context,
      chunk.sessionId,
      chunk.sourceSize,
      chunk.destinationPath,
    );

    const sizeMatches = finished.size === chunk.sourceSize;
    const hashMatches =
      !chunk.sourceContentHash ||
      finished.content_hash === chunk.sourceContentHash;
    if (!sizeMatches || !hashMatches) {
      throw new Error(
        `Transferred file does not match the source: size ${finished.size} vs ${chunk.sourceSize}, content_hash ${finished.content_hash} vs ${chunk.sourceContentHash}.`,
      );
    }

    await archiveSource(context, chunk.sourcePath, chunk.archivePath);
    context.logger.info(
      `Transfer complete: ${chunk.destinationPath} (${finished.size} bytes) matches the source content hash. Original moved to ${chunk.archivePath}.`,
    );

    return {
      data: {
        chunkIndex: chunk.chunkIndex,
        totalChunks: chunk.totalChunks,
        offset: chunk.offset,
        length: chunk.length,
        appendResult,
        finished: {
          destinationPath: chunk.destinationPath,
          size: finished.size,
          contentHash: finished.content_hash,
          sourceContentHash: chunk.sourceContentHash,
          verified: true,
        },
      },
    };
  },
});

export default [transferFile, generateTestFile];
