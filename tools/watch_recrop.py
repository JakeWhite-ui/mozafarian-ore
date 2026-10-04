#!/usr/bin/env python3
"""Recrop the consignment watch photos to upright, tight 4:5 portraits.

The source shots are 4:3 phone photos of a watch sitting in its box, so the
watch fills maybe a fifth of the frame and several are lying on their side.
`card__media` is aspect-ratio 4/5 with object-fit:cover, so the browser was
centre-cropping a landscape box photo — you got a vertical slice of box.

BOX  = watch bounding box, read off a 10% grid overlay (tools/watch_grid.py),
       as fractions of the source width/height.
ROT  = degrees counter-clockwise to bring 12 o'clock to the top.

Originals are preserved in assets/products/_originals/.
"""
import os, shutil, sys
from PIL import Image

SRC      = "assets/products"
BACKUP   = "assets/products/_originals"
RATIO    = 4 / 5          # match .card__media so object-fit:cover is a no-op
PAD      = 0.30           # breathing room around the watch
OUT_W    = 1200

# sku: (x0, y0, x1, y1) as fractions of the source frame
BOX = {
    "0484": (0.52, 0.34, 0.83, 0.68),
    "0487": (0.50, 0.37, 0.74, 0.61),
    "0490": (0.49, 0.33, 0.86, 0.60),
    "0495": (0.60, 0.06, 0.79, 0.52),
    "0497": (0.49, 0.31, 0.72, 0.58),
    "0498": (0.60, 0.08, 0.82, 0.50),
    "0500": (0.42, 0.26, 0.64, 0.52),
    "0501": (0.51, 0.03, 0.74, 0.43),
    "0502": (0.48, 0.33, 0.69, 0.58),
    "0506": (0.55, 0.28, 0.82, 0.52),
    "0507": (0.05, 0.20, 0.59, 0.63),
    "0509": (0.47, 0.31, 0.77, 0.58),
    "0514": (0.50, 0.37, 0.67, 0.54),
    "0518": (0.55, 0.33, 0.77, 0.58),
    "0519": (0.36, 0.22, 0.95, 0.76),
    "0522": (0.55, 0.27, 0.80, 0.52),
    "0523": (0.53, 0.42, 0.82, 0.76),
    "0525": (0.53, 0.30, 0.80, 0.55),
    "0526": (0.55, 0.33, 0.91, 0.71),
    "0529": (0.52, 0.40, 0.85, 0.75),
    "0530": (0.52, 0.36, 0.73, 0.55),
    "0531": (0.48, 0.26, 0.72, 0.48),
    "0533": (0.46, 0.40, 0.71, 0.61),
    "0534": (0.48, 0.26, 0.73, 0.48),
    "0535": (0.56, 0.28, 0.93, 0.70),
}

# Counter-clockwise degrees to stand the watch upright.
# These were shot lying on their side: the crown (3 o'clock on a Nautilus or a
# Santos) points up in frame, so 12 o'clock points left -> turn 90 clockwise.
# The Rolex and AP shots already read upright and are left alone.
ROT = {s: 270 for s in
       ("0525", "0526", "0529", "0530", "0531", "0533", "0534", "0535")}


def sku(path):
    return os.path.basename(path).replace("mwatch-", "").replace(".jpg", "")


def upright(im, box, deg):
    """Rotate the frame, returning the image and the box carried through it."""
    x0, y0, x1, y1 = box
    deg %= 360
    if deg == 0:
        return im, box
    if deg == 90:    # CCW: (x,y) -> (y, 1-x)
        return im.transpose(Image.ROTATE_90), (y0, 1 - x1, y1, 1 - x0)
    if deg == 180:
        return im.transpose(Image.ROTATE_180), (1 - x1, 1 - y1, 1 - x0, 1 - y0)
    if deg == 270:
        return im.transpose(Image.ROTATE_270), (1 - y1, x0, 1 - y0, x1)
    raise ValueError("only 90-degree steps are lossless; got %s" % deg)


def crop(im, box):
    """4:5 window around the box, padded, clamped to the frame."""
    W, H = im.size
    x0, y0, x1, y1 = box[0] * W, box[1] * H, box[2] * W, box[3] * H
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    bw, bh = (x1 - x0) * (1 + 2 * PAD), (y1 - y0) * (1 + 2 * PAD)
    if bw / bh > RATIO:
        bh = bw / RATIO
    else:
        bw = bh * RATIO
    if bw > W:
        bw, bh = W, W / RATIO
    if bh > H:
        bh, bw = H, H * RATIO
    cx = min(max(cx, bw / 2), W - bw / 2)
    cy = min(max(cy, bh / 2), H - bh / 2)
    return im.crop((round(cx - bw / 2), round(cy - bh / 2),
                    round(cx + bw / 2), round(cy + bh / 2)))


def main(outdir=None):
    """outdir=None writes in place (originals backed up first)."""
    os.makedirs(BACKUP, exist_ok=True)
    if outdir:
        os.makedirs(outdir, exist_ok=True)
    for s, box in sorted(BOX.items()):
        name = "mwatch-%s.jpg" % s
        src, bak = os.path.join(SRC, name), os.path.join(BACKUP, name)
        if not os.path.exists(bak):
            shutil.copy2(src, bak)
        im = Image.open(bak).convert("RGB")
        im, box = upright(im, box, ROT.get(s, 0))
        out = crop(im, box).resize((OUT_W, round(OUT_W / RATIO)), Image.LANCZOS)
        out.save(os.path.join(outdir, name) if outdir else src,
                 quality=90, optimize=True)
        print(name, out.size, "rot=%d" % ROT.get(s, 0))


def sheet(outdir, path, cols=7, tw=240):
    """Contact sheet of the results, for eyeballing crop and rotation."""
    from PIL import ImageDraw
    tiles = []
    for s in sorted(BOX):
        im = Image.open(os.path.join(outdir, "mwatch-%s.jpg" % s)).convert("RGB")
        im.thumbnail((tw, tw), Image.LANCZOS)
        d = ImageDraw.Draw(im)
        d.rectangle([0, 0, 46, 20], fill=(0, 0, 0))
        d.text((4, 5), s, fill=(255, 255, 255))
        tiles.append(im)
    w, h = max(t.width for t in tiles), max(t.height for t in tiles)
    rows = -(-len(tiles) // cols)
    out = Image.new("RGB", (cols * w, rows * h), (18, 18, 18))
    for i, t in enumerate(tiles):
        out.paste(t, ((i % cols) * w, (i // cols) * h))
    out.save(path, quality=90)
    print(path, out.size)


if __name__ == "__main__":
    if "--preview" in sys.argv:
        d = sys.argv[sys.argv.index("--preview") + 1]
        main(d)
        sheet(d, os.path.join(d, "_sheet.jpg"))
    else:
        main()
