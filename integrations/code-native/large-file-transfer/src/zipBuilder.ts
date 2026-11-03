/**
 * Minimal ZIP writer for seeding test data: one stored (uncompressed) entry
 * whose payload is written in pieces so the archive can be arbitrarily large
 * without holding it all in memory. Produces a standards-compliant zip
 * (no Zip64, so total size must stay under 4 GiB) that unzips to a single
 * file. This is only for building a realistic input; the transfer flow never
 * inspects zip internals.
 */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

export class Crc32 {
  private crc = 0xffffffff;

  update(bytes: Uint8Array): void {
    let crc = this.crc;
    for (const byte of bytes) {
      crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    }
    this.crc = crc;
  }

  digest(): number {
    return (this.crc ^ 0xffffffff) >>> 0;
  }
}

const dosDateTime = (date: Date): { time: number; date: number } => ({
  time:
    (date.getUTCHours() << 11) |
    (date.getUTCMinutes() << 5) |
    Math.floor(date.getUTCSeconds() / 2),
  date:
    ((date.getUTCFullYear() - 1980) << 9) |
    ((date.getUTCMonth() + 1) << 5) |
    date.getUTCDate(),
});

/**
 * Local file header for a stored entry with a data descriptor. Because the
 * payload is streamed, CRC and sizes are written in the descriptor after the
 * data (general purpose bit 3) instead of in this header.
 */
export const zipLocalHeader = (entryName: string, modified: Date): Buffer => {
  const name = Buffer.from(entryName, "utf8");
  const header = Buffer.alloc(30 + name.length);
  const { time, date } = dosDateTime(modified);
  header.writeUInt32LE(0x04034b50, 0); // local file header signature
  header.writeUInt16LE(20, 4); // version needed: 2.0
  header.writeUInt16LE(0x0008, 6); // flags: data descriptor follows
  header.writeUInt16LE(0, 8); // method: stored
  header.writeUInt16LE(time, 10);
  header.writeUInt16LE(date, 12);
  header.writeUInt32LE(0, 14); // crc (in descriptor)
  header.writeUInt32LE(0, 18); // compressed size (in descriptor)
  header.writeUInt32LE(0, 22); // uncompressed size (in descriptor)
  header.writeUInt16LE(name.length, 26);
  header.writeUInt16LE(0, 28); // extra length
  name.copy(header, 30);
  return header;
};

export const zipDataDescriptor = (crc: number, size: number): Buffer => {
  const descriptor = Buffer.alloc(16);
  descriptor.writeUInt32LE(0x08074b50, 0);
  descriptor.writeUInt32LE(crc, 4);
  descriptor.writeUInt32LE(size, 8);
  descriptor.writeUInt32LE(size, 12);
  return descriptor;
};

/** Central directory (one entry) plus end-of-central-directory record. */
export const zipCentralDirectory = (
  entryName: string,
  modified: Date,
  crc: number,
  size: number,
  localHeaderOffset: number,
): Buffer => {
  const name = Buffer.from(entryName, "utf8");
  const central = Buffer.alloc(46 + name.length);
  const { time, date } = dosDateTime(modified);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4); // version made by
  central.writeUInt16LE(20, 6); // version needed
  central.writeUInt16LE(0x0008, 8);
  central.writeUInt16LE(0, 10); // stored
  central.writeUInt16LE(time, 12);
  central.writeUInt16LE(date, 14);
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(size, 20);
  central.writeUInt32LE(size, 24);
  central.writeUInt16LE(name.length, 28);
  central.writeUInt16LE(0, 30); // extra
  central.writeUInt16LE(0, 32); // comment
  central.writeUInt16LE(0, 34); // disk number start
  central.writeUInt16LE(0, 36); // internal attrs
  central.writeUInt32LE(0, 38); // external attrs
  central.writeUInt32LE(localHeaderOffset, 42);
  name.copy(central, 46);

  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(1, 8); // entries on this disk
  end.writeUInt16LE(1, 10); // total entries
  end.writeUInt32LE(central.length, 12);
  end.writeUInt32LE(localHeaderOffset + 30 + name.length + size + 16, 16); // cd offset
  end.writeUInt16LE(0, 20);
  return Buffer.concat([central, end]);
};
