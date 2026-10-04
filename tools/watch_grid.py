#!/usr/bin/env python3
"""Overlay a labelled 10x10 percent grid so watch bboxes can be read off by eye."""
import sys
from PIL import Image, ImageDraw

TW = 600


def tile(path):
    im = Image.open(path).convert("RGB")
    im.thumbnail((TW, TW), Image.LANCZOS)
    w, h = im.size
    d = ImageDraw.Draw(im, "RGBA")
    for i in range(1, 10):
        x, y = round(w * i / 10), round(h * i / 10)
        d.line([(x, 0), (x, h)], fill=(255, 0, 255, 150), width=1)
        d.line([(0, y), (w, y)], fill=(255, 0, 255, 150), width=1)
        d.text((x + 2, 2), str(i * 10), fill=(255, 255, 0))
        d.text((2, y + 2), str(i * 10), fill=(0, 255, 255))
    d.rectangle([0, h - 18, 120, h], fill=(0, 0, 0))
    d.text((4, h - 15), path.split("/")[-1], fill=(255, 255, 255))
    return im


if __name__ == "__main__":
    # one column keeps each tile at full scale, so percentages read unambiguously
    tiles = [tile(p) for p in sys.argv[2:]]
    cols = 1
    tw, th = max(t.width for t in tiles), max(t.height for t in tiles)
    rows = -(-len(tiles) // cols)
    sheet = Image.new("RGB", (cols * tw, rows * th), (20, 20, 20))
    for i, t in enumerate(tiles):
        sheet.paste(t, ((i % cols) * tw, (i // cols) * th))
    sheet.save(sys.argv[1], quality=90)
    print(sys.argv[1], sheet.size)
