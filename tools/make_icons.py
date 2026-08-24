#!/usr/bin/env python3
"""
Rebuild the favicon set from the vector mark.

Two things were wrong with the old icons. They were built from crown.png,
whose alpha never exceeds 190 — the source itself is semi-transparent, so
every icon derived from it was muted by construction. And they were the bare
line-drawn crown on transparency: downscaled to 32px the hairlines blended
into the transparent ground and landed at rgb(97,81,51) instead of the brand
gold, which is why the mark vanished in the tab strip.

These are built from crown.svg at full strength and rendered as a badge —
solid brand black tile, brand gold, strokes thickened before the downscale so
the line survives at 16 and 32 px, and a solid ground so the mark reads on
both dark and light browser chrome.
"""
import glob, os, re, subprocess, tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

BRAND = '/Users/jakewhite/mozafarian-ore/assets/brand'
SVG = os.path.join(BRAND, 'crown.svg')

GROUND = (11, 11, 12)          # brand near-black, matches the site header
GOLD = (201, 169, 106)         # --gold #C9A96A
GOLD_BRIGHT = (227, 192, 126)  # lifted for the small sizes so the line reads

SS = 8  # supersample factor


def vector_mask(px=2048):
    """Crisp alpha of the mark, rasterised from the SVG via Quick Look.

    crown.svg paints with currentColor, which resolves to nothing outside a
    document, so it is flattened to black on white first and the mask taken
    from luminance.
    """
    s = open(SVG).read().replace('currentColor', '#000000')
    vb = re.search(r'viewBox="([^"]+)"', s).group(1).split()
    s = re.sub(r'(<svg[^>]*>)',
               r'\1<rect x="%s" y="%s" width="%s" height="%s" fill="#ffffff"/>' % tuple(vb),
               s, count=1)
    tmp = tempfile.mkdtemp()
    flat = os.path.join(tmp, 'flat.svg')
    open(flat, 'w').write(s)
    subprocess.run(['qlmanage', '-t', '-s', str(px), '-o', tmp, flat],
                   capture_output=True, check=True)
    a = np.array(Image.open(glob.glob(os.path.join(tmp, '*.png'))[0]).convert('RGBA'))
    ink = ((255 - a[..., :3].mean(2)) * (a[..., 3] > 128)).astype('uint8')
    m = Image.fromarray(ink, 'L')
    return m.crop(m.getbbox())


MASK = None


def build(size, pad_ratio=0.17, radius_ratio=0.22, gold=GOLD, thicken=0):
    big = size * SS
    tile = Image.new('RGBA', (big, big), (0, 0, 0, 0))
    ImageDraw.Draw(tile).rounded_rectangle(
        [0, 0, big - 1, big - 1], radius=int(big * radius_ratio), fill=GROUND + (255,))

    m = MASK
    inner = int(big * (1 - 2 * pad_ratio))
    scale = min(inner / m.width, inner / m.height)
    m = m.resize((max(1, int(m.width * scale)), max(1, int(m.height * scale))), Image.LANCZOS)
    if thicken:
        m = m.filter(ImageFilter.MaxFilter(thicken * 2 + 1))

    layer = Image.new('RGBA', (big, big), (0, 0, 0, 0))
    layer.paste(Image.new('RGBA', m.size, gold + (255,)),
                ((big - m.width) // 2, (big - m.height) // 2), m)
    return Image.alpha_composite(tile, layer).resize((size, size), Image.LANCZOS)


def write_svg_icon():
    """Crisp favicon for browsers that take SVG — same badge, no raster."""
    s = open(SVG).read()
    vb = re.search(r'viewBox="([^"]+)"', s).group(1).split()
    w, h = float(vb[2]), float(vb[3])
    side = max(w, h) * 1.34               # padding around the mark
    ox, oy = (side - w) / 2, (side - h) / 2
    # the paths paint with currentColor, which a parent fill does not override
    body = re.sub(r'^.*?<svg[^>]*>', '', s, flags=re.S).replace('</svg>', '').strip()
    body = body.replace('currentColor', '#C9A96A')
    out = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.0f %.0f">'
        '<rect width="%.0f" height="%.0f" rx="%.0f" fill="#0B0B0C"/>'
        '<g transform="translate(%.0f %.0f)" fill="#C9A96A">%s</g></svg>'
    ) % (side, side, side, side, side * 0.22, ox, oy, body)
    open(os.path.join(BRAND, 'icon.svg'), 'w').write(out)
    return len(out)


def main():
    global MASK
    MASK = vector_mask()
    print('mask %dx%d, ink max %d' % (MASK.width, MASK.height, np.array(MASK).max()))

    # Thickening is tuned per size: enough to keep the hairlines from
    # disappearing, not so much that the crown's negative spaces close up and
    # it reads as a solid blob.
    build(16, pad_ratio=0.10, thicken=2, gold=GOLD_BRIGHT).save(os.path.join(BRAND, 'icon-16.png'))
    build(32, pad_ratio=0.12, thicken=2, gold=GOLD_BRIGHT).save(os.path.join(BRAND, 'icon-32.png'))
    # iOS applies its own corner mask, so the touch icon is full-bleed square
    build(180, pad_ratio=0.18, radius_ratio=0.0, thicken=1).save(os.path.join(BRAND, 'icon-180.png'))
    build(512, pad_ratio=0.19).save(os.path.join(BRAND, 'icon-512.png'))
    print('icon.svg written (%d bytes)' % write_svg_icon())

    for f in ['icon-16.png', 'icon-32.png', 'icon-180.png', 'icon-512.png']:
        a = np.array(Image.open(os.path.join(BRAND, f)).convert('RGB')).reshape(-1, 3)
        print('%-14s brightest %s   pixels above brand gold: %d' % (
            f, tuple(a.max(0)), int((a[:, 0] > 180).sum())))


if __name__ == '__main__':
    main()
