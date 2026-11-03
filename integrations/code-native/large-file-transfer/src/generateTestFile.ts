import { randomFillSync } from "node:crypto";
import { flow } from "@prismatic-io/spectral";
import {
  appendChunk,
  ContentHasher,
  ensureFolders,
  finishUploadSession,
  joinPath,
  normalizeFolder,
  startUploadSession,
} from "./dropboxTransfer";
import {
  Crc32,
  zipCentralDirectory,
  zipDataDescriptor,
  zipLocalHeader,
} from "./zipBuilder";

const DEFAULT_SIZE_MB = 350;
const MAX_SIZE_MB = 3000; // keeps the archive under the 4 GiB limit of the basic zip format
const PIECE_BYTES = 64 * 1024 * 1024;

interface GenerateRequestBody {
  sizeMb?: number | string;
  fileName?: string;
}

const sanitizeFileName = (value: string): string => {
  const name = value.replace(/[^a-zA-Z0-9._-]/g, "-");
  return name.toLowerCase().endsWith(".zip") ? name : `${name}.zip`;
};

// Writes a valid zip archive containing one uncompressed entry of random bytes
// to the source folder, streamed through an upload session 64 MiB at a time.
// Random data does not compress, so the file is a realistic large-file test.
export const generateTestFile = flow({
  name: "Generate Test File",
  stableKey: "generate-test-file",
  description:
    "Create a zip of random data in the source folder so the transfer flow has something to move. Request body: { sizeMb?: number, fileName?: string }.",

  onTrigger: (_context, payload) =>
    Promise.resolve({
      payload,
      response: {
        statusCode: 202,
        contentType: "application/json",
        body: JSON.stringify({ accepted: true }),
      },
    }),

  onExecution: async (context, params) => {
    const body = params.onTrigger.results.body.data as
      GenerateRequestBody | undefined;
    const sizeMb = Math.min(
      Math.max(1, Math.floor(Number(body?.sizeMb) || DEFAULT_SIZE_MB)),
      MAX_SIZE_MB,
    );
    const fileName = sanitizeFileName(
      String(body?.fileName || `test-${sizeMb}mb-${Date.now()}.zip`),
    );
    const sourceFolder = normalizeFolder(context.configVars["Source Folder"]);
    await ensureFolders(context, [sourceFolder]);
    const path = joinPath(sourceFolder, fileName);

    const payloadBytes = sizeMb * 1024 * 1024;
    const entryName = fileName.replace(/\.zip$/i, ".bin");
    const modified = new Date();
    const sessionId = await startUploadSession(context);
    const hasher = new ContentHasher();
    const crc = new Crc32();
    let offset = 0;

    // Every piece goes through the same upload session; the hasher tracks the
    // whole file so the result can be checked against Dropbox's content hash.
    const send = async (piece: Buffer): Promise<void> => {
      hasher.update(piece);
      await appendChunk(
        context,
        { sessionId, offset, length: piece.length },
        piece,
      );
      offset += piece.length;
    };

    // Zip layout: local header, payload, data descriptor, central directory.
    await send(zipLocalHeader(entryName, modified));

    let remaining = payloadBytes;
    while (remaining > 0) {
      const size = Math.min(PIECE_BYTES, remaining);
      const piece = randomFillSync(Buffer.allocUnsafe(size));
      crc.update(piece);
      await send(piece);
      remaining -= size;
      context.logger.info(
        `Wrote ${payloadBytes - remaining} of ${payloadBytes} payload bytes.`,
      );
    }

    const crcValue = crc.digest();
    await send(
      Buffer.concat([
        zipDataDescriptor(crcValue, payloadBytes),
        zipCentralDirectory(entryName, modified, crcValue, payloadBytes, 0),
      ]),
    );

    const finished = await finishUploadSession(
      context,
      sessionId,
      offset,
      path,
    );
    const localHash = hasher.digest();
    if (finished.content_hash !== localHash || finished.size !== offset) {
      throw new Error(
        `Generated file does not match what Dropbox stored: size ${finished.size} vs ${offset}, content_hash ${finished.content_hash} vs ${localHash}.`,
      );
    }

    context.logger.info(
      `Created ${path}: ${offset} bytes, content hash ${localHash}.`,
    );
    return {
      data: { path, bytes: offset, entryName, contentHash: localHash },
    };
  },
});
