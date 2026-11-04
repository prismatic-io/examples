import { createHash } from "node:crypto";
import type { ActionContext, Connection } from "@prismatic-io/spectral";

// Batched-trigger callbacks receive component invokers on `context` but are
// not wrapped in Spectral's ActionContext storage, so the generated manifest
// `.perform()` helpers throw there. `context.components.dropbox.*` works in
// both the trigger and onExecution, so this file uses that form throughout.

/** Dropbox content-hash block size. Also the alignment concurrent upload sessions require. */
export const DROPBOX_BLOCK_BYTES = 4 * 1024 * 1024;
/** Dropbox rejects any single upload request above 150 MiB; 148 MiB is the largest 4 MiB multiple under it. */
export const DROPBOX_MAX_REQUEST_BYTES = 148 * 1024 * 1024;
export const DEFAULT_CHUNK_BYTES = 40 * 1024 * 1024;

const CONTENT_BASE = "https://content.dropboxapi.com/2";

interface DropboxEnvelope<T> {
  data?: { result?: T };
}

export interface DropboxFileMetadata {
  ".tag"?: string;
  id?: string;
  name: string;
  path_lower?: string;
  path_display?: string;
  rev: string;
  size: number;
  content_hash?: string;
  server_modified?: string;
}

interface ListFolderResult {
  entries?: DropboxFileMetadata[];
}

interface TemporaryLinkResult {
  metadata: DropboxFileMetadata;
  link: string;
}

/** One unit of work: a byte range of the source file destined for one upload-session append. */
export interface FileChunk extends Record<string, unknown> {
  chunkIndex: number;
  totalChunks: number;
  offset: number;
  length: number;
  isLast: boolean;
  sourcePath: string;
  sourceRev: string;
  sourceSize: number;
  sourceContentHash?: string;
  sessionId: string;
  destinationPath: string;
  archivePath: string;
}

const unwrap = <T>(value: unknown): T => {
  const result = (value as DropboxEnvelope<T>)?.data?.result;
  if (result === undefined) {
    throw new Error("Dropbox returned an unexpected response shape.");
  }
  return result;
};

const errorText = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const isNotFound = (error: unknown): boolean =>
  /path\/not_found|["/]not_found["/]/i.test(errorText(error));

const isConflict = (error: unknown): boolean =>
  /path\/conflict|to\/conflict|["/]conflict["/]/i.test(errorText(error));

const dropboxConnection = (context: ActionContext): Connection =>
  context.configVars["Dropbox Connection"] as Connection;

const accessToken = (context: ActionContext): string => {
  const token = dropboxConnection(context).token?.access_token;
  if (!token) {
    throw new Error("Dropbox Connection has no access token.");
  }
  return String(token);
};

export const normalizeFolder = (value: unknown): string => {
  const normalized = String(value ?? "")
    .trim()
    .replace(/\/+$/g, "");
  if (!normalized.startsWith("/")) {
    throw new Error(`Dropbox folder "${normalized}" must begin with '/'.`);
  }
  return normalized;
};

export const joinPath = (folder: string, name: string): string =>
  `${folder}/${name.replace(/^\/+/, "")}`;

/**
 * Chunk size from config: a multiple of 4 MiB (Dropbox's block size, which
 * concurrent sessions require), capped below Dropbox's 150 MiB per-request
 * limit. Other destinations have their own rules; see the README.
 */
export const resolveChunkBytes = (value: unknown): number => {
  const mb = Math.floor(Number(value) || 0);
  const requested = mb > 0 ? mb * 1024 * 1024 : DEFAULT_CHUNK_BYTES;
  const aligned =
    Math.max(1, Math.floor(requested / DROPBOX_BLOCK_BYTES)) *
    DROPBOX_BLOCK_BYTES;
  return Math.min(aligned, DROPBOX_MAX_REQUEST_BYTES);
};

/** Split a file of `size` bytes into contiguous ranges of at most `chunkBytes`. */
export const planChunks = (
  size: number,
  chunkBytes: number,
): {
  chunkIndex: number;
  offset: number;
  length: number;
  isLast: boolean;
}[] => {
  if (size <= 0) {
    throw new Error("Cannot transfer an empty file.");
  }
  const total = Math.ceil(size / chunkBytes);
  return Array.from({ length: total }, (_, chunkIndex) => {
    const offset = chunkIndex * chunkBytes;
    const length = Math.min(chunkBytes, size - offset);
    return { chunkIndex, offset, length, isLast: chunkIndex === total - 1 };
  });
};

/**
 * Dropbox content hash: SHA-256 of each 4 MiB block, concatenated, hashed
 * again, hex encoded. Sent with each append so Dropbox rejects corrupted
 * chunks, and compared between source and destination when the copy finishes.
 * https://www.dropbox.com/developers/reference/content-hash
 */
export const dropboxContentHash = (bytes: Uint8Array): string => {
  const outer = createHash("sha256");
  for (let offset = 0; offset < bytes.length; offset += DROPBOX_BLOCK_BYTES) {
    const block = bytes.subarray(
      offset,
      Math.min(offset + DROPBOX_BLOCK_BYTES, bytes.length),
    );
    outer.update(createHash("sha256").update(block).digest());
  }
  return outer.digest("hex");
};

/** Incremental content hash for callers that produce the file in pieces. */
export class ContentHasher {
  private readonly outer = createHash("sha256");
  private pending: Buffer = Buffer.alloc(0);

  update(bytes: Uint8Array): void {
    let data =
      this.pending.length > 0
        ? Buffer.concat([this.pending, Buffer.from(bytes)])
        : Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    while (data.length >= DROPBOX_BLOCK_BYTES) {
      this.outer.update(
        createHash("sha256")
          .update(data.subarray(0, DROPBOX_BLOCK_BYTES))
          .digest(),
      );
      data = data.subarray(DROPBOX_BLOCK_BYTES);
    }
    this.pending = Buffer.from(data);
  }

  digest(): string {
    if (this.pending.length > 0) {
      this.outer.update(createHash("sha256").update(this.pending).digest());
      this.pending = Buffer.alloc(0);
    }
    return this.outer.digest("hex");
  }
}

export const readMetadata = async (
  context: ActionContext,
  path: string,
): Promise<DropboxFileMetadata> =>
  unwrap<DropboxFileMetadata>(
    await context.components.dropbox.getMetadata({
      dropboxConnection: dropboxConnection(context),
      path,
    }),
  );

const ensureFolder = async (
  context: ActionContext,
  path: string,
): Promise<void> => {
  try {
    await readMetadata(context, path);
    return;
  } catch (error) {
    if (!isNotFound(error)) throw error;
  }
  try {
    await context.components.dropbox.createFolder({
      dropboxConnection: dropboxConnection(context),
      path,
    });
  } catch (error) {
    if (!isConflict(error)) throw error;
  }
};

export const ensureFolders = async (
  context: ActionContext,
  folders: string[],
): Promise<void> => {
  for (const folder of folders) {
    const segments = folder.split("/").filter(Boolean);
    let current = "";
    for (const segment of segments) {
      current += `/${segment}`;
      await ensureFolder(context, current);
    }
  }
};

/** Oldest file in the folder, or undefined when there is nothing to transfer. */
export const findOldestFile = async (
  context: ActionContext,
  folder: string,
): Promise<DropboxFileMetadata | undefined> => {
  const listed = unwrap<ListFolderResult>(
    await context.components.dropbox.listFolder({
      dropboxConnection: dropboxConnection(context),
      path: folder,
      fetchAll: true,
      recursive: false,
    }),
  );
  const candidates = (listed.entries ?? [])
    .filter((entry) => entry[".tag"] === "file" && entry.path_lower)
    .sort((left, right) =>
      `${left.server_modified ?? ""}:${left.name}`.localeCompare(
        `${right.server_modified ?? ""}:${right.name}`,
      ),
    );
  context.logger.info(
    `Found ${candidates.length} file(s) in ${folder} (${listed.entries?.length ?? 0} entries total).`,
  );
  return candidates[0];
};

/**
 * Download one byte range through a temporary link. Verifies the file has not
 * changed since the chunk plan was made and that Dropbox honored the range.
 */
export const downloadRange = async (
  context: ActionContext,
  chunk: Pick<
    FileChunk,
    "sourcePath" | "sourceRev" | "sourceSize" | "offset" | "length"
  >,
): Promise<Buffer> => {
  const temporary = unwrap<TemporaryLinkResult>(
    await context.components.dropbox.getTemporaryLink({
      dropboxConnection: dropboxConnection(context),
      path: chunk.sourcePath,
    }),
  );
  if (
    temporary.metadata.rev !== chunk.sourceRev ||
    temporary.metadata.size !== chunk.sourceSize
  ) {
    throw new Error(
      `Source file changed during the transfer (rev ${chunk.sourceRev} -> ${temporary.metadata.rev}).`,
    );
  }

  const end = chunk.offset + chunk.length - 1;
  const response = await fetch(temporary.link, {
    headers: { Range: `bytes=${chunk.offset}-${end}` },
  });
  if (response.status !== 206 && response.status !== 200) {
    throw new Error(
      `Dropbox range download failed with HTTP ${response.status}.`,
    );
  }
  if (
    response.status === 200 &&
    (chunk.offset !== 0 || end < chunk.sourceSize - 1)
  ) {
    throw new Error("Dropbox download did not honor the requested byte range.");
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length !== chunk.length) {
    throw new Error(
      `Dropbox returned ${bytes.length} byte(s) for a ${chunk.length}-byte range.`,
    );
  }
  return bytes;
};

// Upload sessions live on content.dropboxapi.com, which the Dropbox component
// does not expose, so these three calls use the connection's token directly.
// https://www.dropbox.com/developers/documentation/http/documentation#files-upload_session-start

interface DropboxApiError {
  error_summary?: string;
  error?: {
    ".tag"?: string;
    correct_offset?: number;
    lookup_failed?: { ".tag"?: string; correct_offset?: number };
    [key: string]: unknown;
  };
}

const contentRequest = async <T>(
  context: ActionContext,
  route: string,
  apiArg: Record<string, unknown>,
  body?: Buffer,
): Promise<
  | { ok: true; result: T }
  | { ok: false; status: number; error: DropboxApiError }
> => {
  const response = await fetch(`${CONTENT_BASE}/${route}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken(context)}`,
      "Dropbox-API-Arg": JSON.stringify(apiArg),
      "Content-Type": "application/octet-stream",
    },
    body: body ?? Buffer.alloc(0),
  });
  const text = await response.text();
  if (response.ok) {
    return { ok: true, result: (text ? JSON.parse(text) : {}) as T };
  }
  let parsed: DropboxApiError = {};
  try {
    parsed = JSON.parse(text) as DropboxApiError;
  } catch {
    parsed = { error_summary: text.slice(0, 500) };
  }
  return { ok: false, status: response.status, error: parsed };
};

const failFrom = (
  route: string,
  status: number,
  error: DropboxApiError,
): Error =>
  new Error(
    `Dropbox ${route} failed (HTTP ${status}): ${error.error_summary ?? JSON.stringify(error)}`,
  );

export const startUploadSession = async (
  context: ActionContext,
): Promise<string> => {
  const outcome = await contentRequest<{ session_id: string }>(
    context,
    "files/upload_session/start",
    { close: false, session_type: { ".tag": "sequential" } },
  );
  if (!outcome.ok)
    throw failFrom("upload_session/start", outcome.status, outcome.error);
  return outcome.result.session_id;
};

const correctOffsetOf = (error: DropboxApiError): number | undefined =>
  error.error?.correct_offset ?? error.error?.lookup_failed?.correct_offset;

/**
 * Append one chunk at its offset. Safe to retry: if Dropbox reports the
 * session offset is already past this chunk, an earlier attempt landed and
 * the append is treated as done.
 */
export const appendChunk = async (
  context: ActionContext,
  chunk: Pick<FileChunk, "sessionId" | "offset" | "length">,
  bytes: Buffer,
): Promise<"appended" | "already-applied"> => {
  const outcome = await contentRequest<Record<string, never>>(
    context,
    "files/upload_session/append_v2",
    {
      cursor: { session_id: chunk.sessionId, offset: chunk.offset },
      close: false,
      content_hash: dropboxContentHash(bytes),
    },
    bytes,
  );
  if (outcome.ok) return "appended";

  const correct = correctOffsetOf(outcome.error);
  if (correct !== undefined) {
    if (correct >= chunk.offset + chunk.length) {
      context.logger.warn(
        `Session offset is already ${correct}; chunk at ${chunk.offset} was applied by an earlier attempt.`,
      );
      return "already-applied";
    }
    throw new Error(
      `Upload session is at offset ${correct} but this chunk starts at ${chunk.offset}. An earlier chunk has not been appended.`,
    );
  }
  throw failFrom("upload_session/append_v2", outcome.status, outcome.error);
};

/**
 * Commit the session to its destination path. Safe to retry: if the session
 * was already committed, confirm the destination exists at the expected size.
 */
export const finishUploadSession = async (
  context: ActionContext,
  sessionId: string,
  totalBytes: number,
  destinationPath: string,
): Promise<DropboxFileMetadata> => {
  const outcome = await contentRequest<DropboxFileMetadata>(
    context,
    "files/upload_session/finish",
    {
      cursor: { session_id: sessionId, offset: totalBytes },
      commit: {
        path: destinationPath,
        mode: { ".tag": "overwrite" },
        mute: true,
      },
    },
  );
  if (!outcome.ok) {
    const tag = outcome.error.error?.[".tag"];
    const lookup = outcome.error.error?.lookup_failed?.[".tag"];
    if (
      tag === "lookup_failed" &&
      (lookup === "not_found" || lookup === "closed")
    ) {
      try {
        const existing = await readMetadata(context, destinationPath);
        if (existing.size === totalBytes) {
          context.logger.warn(
            `Upload session ${sessionId} was already finished; ${destinationPath} exists at the expected size.`,
          );
          return existing;
        }
      } catch {
        // Fall through and report the original error.
      }
    }
    throw failFrom("upload_session/finish", outcome.status, outcome.error);
  }
  return outcome.result;
};

export const archiveSource = async (
  context: ActionContext,
  fromPath: string,
  toPath: string,
): Promise<void> => {
  try {
    await context.components.dropbox.moveObject({
      dropboxConnection: dropboxConnection(context),
      fromPath,
      toPath,
    });
  } catch (error) {
    if (!isNotFound(error)) throw error;
    // A retried final batch may find the source already moved; confirm the destination exists.
    await readMetadata(context, toPath);
  }
};
