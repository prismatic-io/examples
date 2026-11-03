import { createHash } from "node:crypto";
import {
  ContentHasher,
  DROPBOX_BLOCK_BYTES,
  DROPBOX_MAX_REQUEST_BYTES,
  dropboxContentHash,
  planChunks,
  resolveChunkBytes,
} from "./dropboxTransfer";
import {
  Crc32,
  zipCentralDirectory,
  zipDataDescriptor,
  zipLocalHeader,
} from "./zipBuilder";

describe("planChunks", () => {
  test("covers the file exactly once with a short final chunk", () => {
    const plan = planChunks(250, 100);
    expect(plan.map((c) => [c.offset, c.length, c.isLast])).toEqual([
      [0, 100, false],
      [100, 100, false],
      [200, 50, true],
    ]);
    expect(plan.reduce((sum, c) => sum + c.length, 0)).toBe(250);
    expect(planChunks(100, 100)).toHaveLength(1);
    expect(() => planChunks(0, 100)).toThrow();
  });
});

describe("resolveChunkBytes", () => {
  test("aligns to 4 MiB and caps below Dropbox's 150 MiB request limit", () => {
    expect(resolveChunkBytes("100")).toBe(100 * 1024 * 1024);
    expect(resolveChunkBytes("100") % DROPBOX_BLOCK_BYTES).toBe(0);
    expect(resolveChunkBytes("7")).toBe(4 * 1024 * 1024);
    expect(resolveChunkBytes("1")).toBe(4 * 1024 * 1024);
    expect(resolveChunkBytes("500")).toBe(DROPBOX_MAX_REQUEST_BYTES);
    expect(DROPBOX_MAX_REQUEST_BYTES).toBe(148 * 1024 * 1024);
    expect(DROPBOX_MAX_REQUEST_BYTES % DROPBOX_BLOCK_BYTES).toBe(0);
    expect(resolveChunkBytes(undefined)).toBe(40 * 1024 * 1024);
  });
});

describe("dropboxContentHash", () => {
  test("matches the published algorithm for small and multi-block inputs", () => {
    const small = Buffer.from("hello world");
    const expectedSmall = createHash("sha256")
      .update(createHash("sha256").update(small).digest())
      .digest("hex");
    expect(dropboxContentHash(small)).toBe(expectedSmall);

    const big = Buffer.alloc(DROPBOX_BLOCK_BYTES + 12345, 7);
    const blockA = createHash("sha256")
      .update(big.subarray(0, DROPBOX_BLOCK_BYTES))
      .digest();
    const blockB = createHash("sha256")
      .update(big.subarray(DROPBOX_BLOCK_BYTES))
      .digest();
    const expectedBig = createHash("sha256")
      .update(Buffer.concat([blockA, blockB]))
      .digest("hex");
    expect(dropboxContentHash(big)).toBe(expectedBig);
  });

  test("ContentHasher gives the same hash regardless of piece boundaries", () => {
    const data = Buffer.alloc(3 * DROPBOX_BLOCK_BYTES + 999);
    for (let i = 0; i < data.length; i += 4096) data[i] = i & 0xff;
    const whole = dropboxContentHash(data);

    const uneven = new ContentHasher();
    uneven.update(data.subarray(0, 1000));
    uneven.update(data.subarray(1000, DROPBOX_BLOCK_BYTES + 5));
    uneven.update(data.subarray(DROPBOX_BLOCK_BYTES + 5));
    expect(uneven.digest()).toBe(whole);

    const aligned = new ContentHasher();
    for (let o = 0; o < data.length; o += DROPBOX_BLOCK_BYTES) {
      aligned.update(
        data.subarray(o, Math.min(o + DROPBOX_BLOCK_BYTES, data.length)),
      );
    }
    expect(aligned.digest()).toBe(whole);
  });
});

describe("zipBuilder", () => {
  test("Crc32 matches the standard check value", () => {
    const crc = new Crc32();
    crc.update(Buffer.from("123456789"));
    expect(crc.digest()).toBe(0xcbf43926);
  });

  test("structures carry the right signatures, sizes, and offsets", () => {
    const modified = new Date(Date.UTC(2026, 0, 1, 12, 0, 0));
    const payload = Buffer.from("payload bytes");
    const crc = new Crc32();
    crc.update(payload);

    const header = zipLocalHeader("a.bin", modified);
    const descriptor = zipDataDescriptor(crc.digest(), payload.length);
    const central = zipCentralDirectory(
      "a.bin",
      modified,
      crc.digest(),
      payload.length,
      0,
    );
    const archive = Buffer.concat([header, payload, descriptor, central]);

    expect(header.readUInt32LE(0)).toBe(0x04034b50);
    expect(descriptor.readUInt32LE(0)).toBe(0x08074b50);
    expect(central.readUInt32LE(0)).toBe(0x02014b50);

    const eocd = archive.subarray(archive.length - 22);
    expect(eocd.readUInt32LE(0)).toBe(0x06054b50);
    const cdOffset = eocd.readUInt32LE(16);
    expect(cdOffset).toBe(header.length + payload.length + descriptor.length);
    expect(archive.readUInt32LE(cdOffset)).toBe(0x02014b50);
    expect(eocd.readUInt32LE(12)).toBe(central.length - 22);
    expect(archive.readUInt32LE(cdOffset + 20)).toBe(payload.length);
  });
});
