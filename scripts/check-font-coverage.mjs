import { readFileSync } from 'node:fs';
import { brotliDecompressSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// WOFF2 leaves cmap untransformed. Read that table directly so the build guard
// needs only Node (fonttools is needed only when regenerating the subset).
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fontPath = process.argv[2] || path.join(root, 'assets/fonts/PretendardVariable.subset.woff2');
const font = readFileSync(fontPath);
if (font.toString('ascii', 0, 4) !== 'wOF2') throw new Error('Expected a WOFF2 font');
// The predefined WOFF2 tag indices for transformed tables are fixed by the spec.
let cursor = 48;
function uintBase128() {
  let n = 0;
  for (let i = 0; i < 5; i++) {
    const b = font[cursor++];
    if (b === undefined || (i === 0 && b === 0x80) || n > 0x1ffffff) throw new Error('Invalid WOFF2 directory');
    n = n * 128 + (b & 127);
    if (!(b & 128)) return n;
  }
  throw new Error('Invalid WOFF2 integer');
}
let tableOffset = 0, cmapEntry;
for (let i = 0; i < font.readUInt16BE(12); i++) {
  const flags = font[cursor++], index = flags & 63, version = flags >> 6;
  let tag;
  if (index === 63) { tag = font.toString('ascii', cursor, cursor + 4); cursor += 4; }
  else tag = index === 0 ? 'cmap' : null;
  const originalLength = uintBase128();
  const transformed = index === 10 || index === 11 ? version !== 3 : version !== 0;
  const length = transformed ? uintBase128() : originalLength;
  if (tag === 'cmap') {
    if (transformed) throw new Error('Unsupported transformed cmap');
    cmapEntry = { offset: tableOffset, length };
  }
  tableOffset += length;
}
if (!cmapEntry) throw new Error('Font has no cmap');
const tables = brotliDecompressSync(font.subarray(cursor, cursor + font.readUInt32BE(20)));
const cmap = tables.subarray(cmapEntry.offset, cmapEntry.offset + cmapEntry.length);
const covered = new Set();
for (let i = 0; i < cmap.readUInt16BE(2); i++) {
  const entry = 4 + i * 8, platform = cmap.readUInt16BE(entry), encoding = cmap.readUInt16BE(entry + 2);
  if (platform !== 0 && !(platform === 3 && (encoding === 1 || encoding === 10))) continue;
  const offset = cmap.readUInt32BE(entry + 4), format = cmap.readUInt16BE(offset);
  if (format === 12) {
    for (let g = 0; g < cmap.readUInt32BE(offset + 12); g++) {
      const p = offset + 16 + g * 12, start = cmap.readUInt32BE(p), end = cmap.readUInt32BE(p + 4), glyph = cmap.readUInt32BE(p + 8);
      for (let cp = start; cp <= end; cp++) if (glyph + cp - start !== 0) covered.add(cp);
    }
  } else if (format === 4) {
    const count = cmap.readUInt16BE(offset + 6) / 2, ends = offset + 14, starts = ends + count * 2 + 2, deltas = starts + count * 2, ranges = deltas + count * 2;
    for (let seg = 0; seg < count; seg++) {
      const start = cmap.readUInt16BE(starts + seg * 2), end = cmap.readUInt16BE(ends + seg * 2), delta = cmap.readInt16BE(deltas + seg * 2), range = cmap.readUInt16BE(ranges + seg * 2);
      for (let cp = start; cp <= end && cp < 0xffff; cp++) {
        let glyph = range ? cmap.readUInt16BE(ranges + seg * 2 + range + (cp - start) * 2) : cp;
        if (!range || glyph) glyph = (glyph + delta) & 0xffff;
        if (glyph) covered.add(cp);
      }
    }
  }
}
const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', copy: '©', ndash: '–', mdash: '—', hellip: '…', rarr: '→' };
const missing = {};
for (const file of ['index.html', '404.html']) {
  const source = readFileSync(path.join(root, file), 'utf8');
  const decoded = source.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (whole, entity) => entity[0] === '#' ? String.fromCodePoint(entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1))) : entities[entity] || whole);
  const needed = new Set(Array.from(source + decoded).filter(c => !/[\u0000-\u001f\u007f]/u.test(c)).map(c => c.codePointAt(0)));
  const absent = [...needed].filter(cp => !covered.has(cp)).sort((a, b) => a - b);
  if (absent.length) missing[file] = absent.map(cp => `${String.fromCodePoint(cp)} U+${cp.toString(16).toUpperCase()}`);
}
if (Object.keys(missing).length) {
  console.error('Font coverage FAILED:', JSON.stringify(missing));
  process.exitCode = 1;
} else console.log(`Font coverage OK: missing 0; ${(font.length / 1024).toFixed(1)} KiB; ${covered.size} mapped code points`);
