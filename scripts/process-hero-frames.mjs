// One-off asset pipeline: takes the raw `ezgif-frame-NNN.png` sequence (a
// glow/bloom render on a near-black background, no alpha channel) and
// produces a lightweight WebP sequence at `public/hero-frames/frame-NNN.webp`
// for the hero's scroll-driven canvas.
//
// No alpha keying here — the frames are drawn on a plain opaque background
// and composited onto the page with CSS `mix-blend-mode: screen`
// (hero-frame-sequence.tsx), not canvas transparency. Screen blending is
// the physically correct way to composite an additive glow/bloom render:
// a black pixel contributes nothing to whatever's behind it and a bright
// pixel adds light, which — unlike alpha-blending a "keyed" translucent
// color — looks right against *any* backdrop color, light or dark, with
// no halo smudge, no lost interior shading, and no edge fringing. Three
// earlier keying approaches (border-flood-fill, threshold+smoothstep,
// direct premultiply) all fought this same problem because alpha-over
// compositing is fundamentally the wrong operation for additive light.
//
// Run: node scripts/process-hero-frames.mjs
// (safe to re-run — reads from public/ first, falls back to the archive
// dir so already-archived raw sources can be reprocessed)

import sharp from "sharp";
import { readdir, mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PUBLIC_DIR = path.join(ROOT, "public");
const ARCHIVE_DIR = path.join(ROOT, ".design-reference/hero-frames-src");
const OUT_DIR = path.join(ROOT, "public/hero-frames");

const TARGET_WIDTH = 960;
// Optional bounds (inclusive) so a trimmed frame range — e.g. the earliest
// frames were deliberately dropped from the shipped sequence — can be
// reprocessed without regenerating (and re-shipping) frames outside it.
const FRAME_MIN = process.env.FRAME_MIN ? Number(process.env.FRAME_MIN) : null;
const FRAME_MAX = process.env.FRAME_MAX ? Number(process.env.FRAME_MAX) : null;

async function processFrame(srcPath, outPath) {
  await sharp(srcPath)
    .resize({ width: TARGET_WIDTH })
    .webp({ quality: 82 })
    .toFile(outPath);
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
    .filter(({ number }) => {
      const n = Number(number);
      if (FRAME_MIN !== null && n < FRAME_MIN) return false;
      if (FRAME_MAX !== null && n > FRAME_MAX) return false;
      return true;
    })
    .sort((a, b) => a.number.localeCompare(b.number));

  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(ARCHIVE_DIR, { recursive: true });

  const archiving = srcDir !== ARCHIVE_DIR;

  for (const { file, number } of files) {
    const srcPath = path.join(srcDir, file);
    const outPath = path.join(OUT_DIR, `frame-${number}.webp`);
    await processFrame(srcPath, outPath);
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
