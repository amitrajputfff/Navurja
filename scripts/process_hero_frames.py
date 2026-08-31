#!/usr/bin/env python3
"""One-off asset pipeline: takes the raw ezgif-frame-NNN.png sequence (a
glow/bloom render on a near-black background, no alpha channel) and
produces a lightweight, alpha-keyed WebP sequence at
public/hero-frames/frame-NNN.webp for the hero's scroll-driven canvas.

This footage is additive glow rendered onto black -- every pixel's own
brightness *is* how much light it is, which is exactly what premultiplied
alpha compositing onto a black backdrop looks like. So alpha = max(r, g, b)
directly, and color is recovered by unpremultiplying (rgb * 255 / alpha).
The site is light-mode only, so plain alpha compositing (not a
mix-blend-mode: screen trick, which only looks right on a dark backdrop)
is the correct choice here.

Usage:
    python3 scripts/process_hero_frames.py

Reads every ezgif-frame-*.png found in public/png/ (falling back to
public/ itself for convenience), resizes to TARGET_WIDTH, and writes
public/hero-frames/frame-NNN.webp. Safe to re-run.
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC_CANDIDATES = [ROOT / "public" / "png", ROOT / "public"]
OUT_DIR = ROOT / "public" / "hero-frames"

TARGET_WIDTH = 960
WEBP_QUALITY = 82


def find_source_dir() -> Path | None:
    for candidate in SRC_CANDIDATES:
        if not candidate.is_dir():
            continue
        if any(candidate.glob("ezgif-frame-*.png")):
            return candidate
    return None


def key_frame(src_path: Path) -> Image.Image:
    img = Image.open(src_path).convert("RGB")
    width, height = img.size
    if width != TARGET_WIDTH:
        target_height = round(height * TARGET_WIDTH / width)
        img = img.resize((TARGET_WIDTH, target_height), Image.LANCZOS)

    rgb = np.asarray(img, dtype=np.float32)  # (H, W, 3)
    alpha = rgb.max(axis=2)  # (H, W), 0..255 — brightness *is* alpha here

    # Unpremultiply: recover the "true" saturated color the light was
    # before it got composited onto black. Guard div-by-zero for fully
    # transparent pixels (alpha == 0) — they stay black/transparent.
    safe_alpha = np.where(alpha == 0, 1, alpha)
    out_rgb = np.clip(rgb * 255.0 / safe_alpha[..., None], 0, 255)
    out_rgb = np.where(alpha[..., None] == 0, 0, out_rgb)

    rgba = np.dstack([out_rgb, alpha]).astype(np.uint8)
    return Image.fromarray(rgba, mode="RGBA")


def main() -> None:
    src_dir = find_source_dir()
    if src_dir is None:
        print("No ezgif-frame-*.png files found in public/png/ or public/.")
        return

    files = sorted(src_dir.glob("ezgif-frame-*.png"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for i, src_path in enumerate(files, start=1):
        number = src_path.stem.rsplit("-", 1)[-1]  # "ezgif-frame-051" -> "051"
        out_path = OUT_DIR / f"frame-{number}.webp"
        frame = key_frame(src_path)
        frame.save(out_path, format="WEBP", quality=WEBP_QUALITY)
        sys.stdout.write(f"\rProcessed {i}/{len(files)}")
        sys.stdout.flush()

    print(f"\nDone — {len(files)} frames -> {OUT_DIR.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
