#!/usr/bin/env python3
"""Find the watch in a box photo and crop a tight 4:5 portrait around it.

The box interiors are smooth suede/leather; the watch is the only object with
dense high-frequency detail. So: edge magnitude -> heavy blur -> threshold ->
largest connected blob -> bbox. Pure PIL, no numpy on this machine.
"""
import sys, json
from PIL import Image, ImageFilter, ImageDraw, ImageChops

SMALL_W = 480                 # analysis resolution
HP      = 1.5                 # high-pass scale
EDGE    = 12                  # binarisation cutoff for "this pixel has detail"
BLUR    = 14                  # density window
THRESH  = 0.42                # fraction of peak density
PAD     = 0.26                # padding around the blob, fraction of blob size
RATIO   = 4 / 5               # target w/h (card__media is aspect-ratio 4/5)


def density_map(im):
    """Density of *detail pixels*, not edge magnitude.

    A box seam is one long thin high-contrast line: few detail pixels per
    window. A bracelet or a dial is dense micro-structure: many. Binarising
    before the blur is what separates the two — magnitude alone picks the box.
    """
    w, h = im.size
    sw = SMALL_W
    sh = max(1, round(h * sw / w))
    g = im.convert("L").resize((sw, sh), Image.LANCZOS)
    lo = g.filter(ImageFilter.GaussianBlur(HP))
    hp = ImageChops.difference(g, lo)
    binary = hp.point(lambda v: 255 if v >= EDGE else 0)
    return binary.filter(ImageFilter.GaussianBlur(BLUR)), sw, sh


MAX_ASPECT = 3.0   # a watch is roughly as wide as it is tall; a box seam is not
MAX_SPAN   = 0.88  # a blob running the full width/height of the frame is the box
MIN_AREA   = 0.012 # a blob under ~1% of frame is engraved box branding, not a watch


def best_blob_bbox(px, sw, sh, cutoff):
    """Flood-fill the mask and pick the most *watch-shaped* component.

    Raw area picks the box: a lid seam is one long thin line whose blurred
    footprint can out-area the watch. Scoring by area x fill-ratio, and
    rejecting elongated or frame-spanning blobs, picks the compact one.
    """
    mask = [1 if px[i] >= cutoff else 0 for i in range(sw * sh)]
    seen = [0] * (sw * sh)
    best, best_score = None, 0.0
    for start in range(sw * sh):
        if not mask[start] or seen[start]:
            continue
        stack = [start]
        seen[start] = 1
        x0 = x1 = start % sw
        y0 = y1 = start // sw
        n = 0
        while stack:
            i = stack.pop()
            n += 1
            x, y = i % sw, i // sw
            if x < x0: x0 = x
            if x > x1: x1 = x
            if y < y0: y0 = y
            if y > y1: y1 = y
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if 0 <= nx < sw and 0 <= ny < sh:
                    j = ny * sw + nx
                    if mask[j] and not seen[j]:
                        seen[j] = 1
                        stack.append(j)
        bw, bh = x1 - x0 + 1, y1 - y0 + 1
        if n < MIN_AREA * sw * sh:
            continue
        if max(bw / bh, bh / bw) > MAX_ASPECT:
            continue
        if bw / sw > MAX_SPAN or bh / sh > MAX_SPAN:
            continue
        score = n * (n / (bw * bh))      # area x how solidly it fills its bbox
        if score > best_score:
            best_score, best = score, (x0, y0, x1 + 1, y1 + 1)
    return best


def detect(path):
    """Return the watch bbox in source pixels, or None."""
    im = Image.open(path)
    W, H = im.size
    e, sw, sh = density_map(im)
    px = list(e.getdata())
    peak = max(px)
    if peak == 0:
        return None
    box = best_blob_bbox(px, sw, sh, peak * THRESH)
    if box is None:
        return None
    sx, sy = W / sw, H / sh
    return (box[0] * sx, box[1] * sy, box[2] * sx, box[3] * sy)


def crop_box(bbox, W, H, ratio=RATIO, pad=PAD):
    """Expand bbox to a `ratio` rectangle with padding, clamped to the image."""
    x0, y0, x1, y1 = bbox
    bw, bh = x1 - x0, y1 - y0
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2

    # pad, then grow whichever side is short to hit the target ratio
    bw *= 1 + 2 * pad
    bh *= 1 + 2 * pad
    if bw / bh > ratio:
        bh = bw / ratio
    else:
        bw = bh * ratio

    # never upscale past the source
    if bw > W:
        bw, bh = W, W / ratio
    if bh > H:
        bh, bw = H, H * ratio

    cx = min(max(cx, bw / 2), W - bw / 2)
    cy = min(max(cy, bh / 2), H - bh / 2)
    return (round(cx - bw / 2), round(cy - bh / 2),
            round(cx + bw / 2), round(cy + bh / 2))


if __name__ == "__main__":
    out = {}
    for p in sys.argv[1:]:
        im = Image.open(p)
        b = detect(p)
        out[p] = {"size": im.size,
                  "bbox": [round(v) for v in b] if b else None,
                  "crop": crop_box(b, *im.size) if b else None}
    print(json.dumps(out, indent=1))
