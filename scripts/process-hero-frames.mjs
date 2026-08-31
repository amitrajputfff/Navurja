// One-off asset pipeline: takes the raw `ezgif-frame-NNN.png` sequence (a
// glow/bloom render on a near-black background, no alpha channel) and
// produces a lightweight, properly-keyed WebP sequence at
// `public/hero-frames/frame-NNN.webp` for the hero's scroll-driven canvas.
//
// This footage is additive glow rendered onto black — every pixel's own
// brightness *is* how much light it is, which is exactly what premultiplied
// alpha compositing onto a black backdrop looks like. So alpha = max(r,g,b)
// directly, and color is recovered by unpremultiplying (rgb * 255 / alpha).
// Two earlier approaches were tried and both left artifacts on this
// footage: (1) flood-filling from the border so only background reachable
// from the edge got keyed left "enclosed" dark regions (e.g. the interior
// of the ring-shaped frame) as an opaque black patch; (2) a smoothstepped
// LOW/HIGH threshold band left a visible dim, semi-opaque "shadow halo"
// around frames with a wide soft glow, because a wide mid-brightness band
// stayed mostly-opaque while still carrying its dim, un-brightened color.
// Direct premultiply unprojection has neither problem: a dim halo pixel
// gets a low alpha *and* its color is boosted back to true brightness by
// the unpremultiply, so it reads as "a little bit of bright light," not
// "a dark, half-see-through smudge."
//
// Run: node scripts/process-hero-frames.mjs
// (safe to re-run — reads from public/ first, falls back to the archive
// dir so already-archived raw sources can be reprocessed with new tuning)

import sharp from "sharp";
import { readdir, mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PUBLIC_DIR = path.join(ROOT, "public");
const ARCHIVE_DIR = path.join(ROOT, ".design-reference/hero-frames-src");
const OUT_DIR = path.join(ROOT, "public/hero-frames");

const TARGET_WIDTH = 960;
const NOISE_FLOOR = 3; // brightness at/below this -> fully transparent (kills near-zero compression noise)

async function keyFrame(srcPath) {
  const { data, info } = await sharp(srcPath)
    .resize({ width: TARGET_WIDTH })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const n = width * height;
  const out = Buffer.alloc(n * 4);

  for (let p = 0; p < n; p++) {
    const si = p * channels;
    const oi = p * 4;
    const r = data[si];
    const g = data[si + 1];
    const b = data[si + 2];
    const a = r > g ? (r > b ? r : b) : g > b ? g : b;

    if (a <= NOISE_FLOOR) {
      out[oi] = 0;
      out[oi + 1] = 0;
      out[oi + 2] = 0;
      out[oi + 3] = 0;
    } else if (a >= 255) {
      out[oi] = r;
      out[oi + 1] = g;
      out[oi + 2] = b;
      out[oi + 3] = 255;
    } else {
      out[oi] = Math.min(255, Math.round((r * 255) / a));
      out[oi + 1] = Math.min(255, Math.round((g * 255) / a));
      out[oi + 2] = Math.min(255, Math.round((b * 255) / a));
      out[oi + 3] = a;
    }
  }

  return sharp(out, { raw: { width, height, channels: 4 } });
}

async function findSourceDir() {
  const inPublic = (await readdir(PUBLIC_DIR)).some((f) =>
    /^ezgif-frame-\d+\.png$/.test(f)
  );
  if (inPublic) return PUBLIC_DIR;

  try {
    const inArchive = (await readdir(ARCHIVE_DIR)).some((f) =>
      /^ezgif-frame-\d+\.png$/.test(f)
    );
    if (inArchive) return ARCHIVE_DIR;
  } catch {
    // archive dir doesn't exist yet — fall through
  }
  return null;
}

async function main() {
  const srcDir = await findSourceDir();
  if (!srcDir) {
    console.log(
      "No ezgif-frame-*.png files found in public/ or the archive dir."
    );
    return;
  }

  const entries = await readdir(srcDir);
  const files = entries
    .map((f) => {
      const match = /^ezgif-frame-(\d+)\.png$/.exec(f);
      return match ? { file: f, number: match[1] } : null;
    })
    .filter((x) => x !== null)
    .sort((a, b) => a.number.localeCompare(b.number));

  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(ARCHIVE_DIR, { recursive: true });

  const archiving = srcDir !== ARCHIVE_DIR;

  for (const { file, number } of files) {
    const srcPath = path.join(srcDir, file);
    const image = await keyFrame(srcPath);
    const outPath = path.join(OUT_DIR, `frame-${number}.webp`);
    await image.webp({ quality: 82, alphaQuality: 90 }).toFile(outPath);
    if (archiving) {
      await rename(srcPath, path.join(ARCHIVE_DIR, file));
    }
    process.stdout.write(`\rProcessed ${number}/${files[files.length - 1].number}`);
  }

  console.log(`\nDone — ${files.length} frames -> ${path.relative(ROOT, OUT_DIR)}`);
  if (archiving) {
    console.log(`Raw sources archived to ${path.relative(ROOT, ARCHIVE_DIR)} (gitignored).`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
