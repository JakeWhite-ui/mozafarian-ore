#!/usr/bin/env python3
"""Contact sheet of autocrop detections: red = detected watch, green = 4:5 crop."""
import sys, glob
from PIL import Image, ImageDraw
from watch_autocrop import detect, crop_box

COLS, TW = 4, 420


def tile(path):
    im = Image.open(path).convert("RGB")
    W, H = im.size
    d = ImageDraw.Draw(im)
    b = detect(path)
    if b:
        d.rectangle([round(v) for v in b], outline=(255, 40, 40), width=6)
        d.rectangle(crop_box(b, W, H), outline=(40, 230, 90), width=6)
    im.thumbnail((TW, TW), Image.LANCZOS)
    d = ImageDraw.Draw(im)
    label = path.split("/")[-1].replace("mwatch-", "").replace(".jpg", "")
    d.rectangle([0, 0, 64, 26], fill=(0, 0, 0))
    d.text((6, 8), label, fill=(255, 255, 255))
    return im


if __name__ == "__main__":
    paths = sorted(sys.argv[2:] or glob.glob("assets/products/mwatch-*.jpg"))
    tiles = [tile(p) for p in paths]
    tw, th = max(t.width for t in tiles), max(t.height for t in tiles)
    rows = -(-len(tiles) // COLS)
    sheet = Image.new("RGB", (COLS * tw, rows * th), (20, 20, 20))
    for i, t in enumerate(tiles):
        sheet.paste(t, ((i % COLS) * tw, (i // COLS) * th))
    sheet.save(sys.argv[1], quality=88)
    print(sys.argv[1], sheet.size, len(tiles), "tiles")
