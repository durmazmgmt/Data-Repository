#!/usr/bin/env python3
"""Deterministically extract representative sRGB colors from approved logo artwork.

Usage:
    python scripts/extract-brand-palette.py KEY=path/to/logo.png [KEY=path/to/logo2.jpg ...]

The script never modifies inputs. It resizes for bounded processing, ignores
transparent and near-white background pixels, uses Pillow's deterministic
median-cut quantization, and prints JSON candidates ordered by pixel count.
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

from PIL import Image, ImageOps

MAX_SIZE = 256
COLOR_COUNT = 10


def extract(path: Path) -> list[dict[str, object]]:
    image = ImageOps.exif_transpose(Image.open(path)).convert("RGBA")
    image.thumbnail((MAX_SIZE, MAX_SIZE), Image.Resampling.LANCZOS)

    pixels: list[tuple[int, int, int]] = []
    for red, green, blue, alpha in image.getdata():
        if alpha < 64:
            continue
        if red > 245 and green > 245 and blue > 245:
            continue
        if red > 238 and green > 238 and blue > 238 and max(red, green, blue) - min(red, green, blue) < 8:
            continue
        pixels.append((red, green, blue))

    if not pixels:
        raise ValueError(f"{path}: no non-background pixels found")

    sample = Image.new("RGB", (len(pixels), 1))
    sample.putdata(pixels)
    quantized = sample.quantize(colors=COLOR_COUNT, method=Image.Quantize.MEDIANCUT)
    palette = quantized.getpalette()
    counts = Counter(quantized.getdata())

    result = []
    for index, count in counts.most_common():
        rgb = tuple(palette[index * 3 : index * 3 + 3])
        result.append(
            {
                "hex": "#{:02X}{:02X}{:02X}".format(*rgb),
                "count": count,
                "percent": round(count / len(pixels) * 100, 2),
            }
        )
    return result


def main(argv: list[str]) -> int:
    if not argv:
        print("Provide at least one KEY=PATH argument.", file=sys.stderr)
        return 2

    output: dict[str, list[dict[str, object]]] = {}
    for argument in argv:
        if "=" not in argument:
            print(f"Invalid argument: {argument}", file=sys.stderr)
            return 2
        key, raw_path = argument.split("=", 1)
        path = Path(raw_path)
        if not key or not path.is_file():
            print(f"Invalid logo mapping: {argument}", file=sys.stderr)
            return 2
        output[key] = extract(path)

    print(json.dumps(output, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
