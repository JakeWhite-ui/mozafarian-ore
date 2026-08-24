#!/usr/bin/env python3
"""
Ingest the 33-piece consignment sheet (SKU, specs, IGI/GIA certs, USD retail
price and the embedded product photo) into the Mozafarian catalogue.

Only customer-facing fields are published. Lot numbers, labour, GST and the
other cost lines in the sheet stay out of products.json.
"""
import json, os, re, shutil, zipfile
import openpyxl
from PIL import Image

XLSX = '/Users/jakewhite/Downloads/33 PCS CONSIGNMENT MOZAFARIAN RETAIL PRICE (1).xlsx'
SITE = '/Users/jakewhite/mozafarian-ore'
OUT_IMG = os.path.join(SITE, 'assets/products')
DATA = os.path.join(SITE, 'data/products.json')

# A photo is publishable only if it is genuinely a shot of the piece and big
# enough for a full-bleed card. The sheet also carries two supplier marketing
# cards (another brand's "FLORA COLLECTION" artwork) which must never go live.
MIN_SIDE = 440
BRAND_CARDS = {'BKJ-036', 'BKJ-038'}

# SKU -> (site category, title). Categories match the existing taxonomy;
# earrings live under "Jewellery" the same way the menu links them.
PIECES = {
    'BKJ-025':      ('Rings',      'Estrella Lite — Fancy Light Yellow Diamond Star Ring'),
    'BKJ-036':      ('Rings',      'Fania — Pear-Cut Fancy Yellow Diamond Ring'),
    'BKJ-038':      ('Rings',      'Nova — Cushion-Cut Fancy Yellow Diamond Ring'),
    'BKJ-048':      ('Jewellery',  'Magic Wand — Fancy Yellow Diamond Star Drop Earrings'),
    'BKJ-050':      ('Jewellery',  'Magic Wand — Fancy Yellow Diamond Star Earrings'),
    'BKJ-102':      ('Rings',      'Helene — Fancy Light Yellow Diamond Ring'),
    'BKJ-131':      ('Rings',      'Daisy — Fancy Light Yellow Diamond Cluster Ring'),
    'BYER-009':     ('Jewellery',  'Fancy Light Yellow Diamond Cluster Earrings'),
    'CPER-039':     ('Jewellery',  'Fancy Brownish Pink Diamond Pear Drop Earrings'),
    'HPER-035':     ('Jewellery',  'Fancy Intense Orangy Pink Diamond Tassel Earrings'),
    'IYBR-524':     ('Bangles',    'Fancy Yellow Diamond Cushion Line Bracelet'),
    'IYBR-981':     ('Bangles',    'Fancy Yellow Diamond Star Bangle · 18K Rose Gold'),
    'IYER-1627':    ('Jewellery',  'Natural Light Yellow Diamond Star Drop Earrings'),
    'IYER-1893':    ('Jewellery',  'Natural Light Yellow Diamond Star Earrings'),
    'IYER-770':     ('Jewellery',  'Fancy Light Yellow Diamond Cluster Studs'),
    'IYP-1610':     ('Necklaces',  'Fancy Yellow Diamond Butterfly Pendant'),
    'IYR-118':      ('Rings',      'Fancy Intense Yellow Diamond Cluster Ring'),
    'IYR-875':      ('Rings',      'Natural Light Yellow Diamond Band'),
    'JC3S-G058':    ('Rings',      'Fancy Pink Diamond Heart Ring · 1.02 ct · GIA'),
    'JHAF-G907G909':('Jewellery',  'Fancy Light Yellow Diamond Cushion Earrings · GIA'),
    'JSAG-062':     ('Rings',      'Fancy Light Yellow Diamond Ring · 1.00 ct · GIA'),
    'JSAG-138':     ('Rings',      'Fancy Light Yellow Diamond Ring · 1.01 ct · GIA'),
    'JYFG-189':     ('Rings',      'Fancy Intense Yellow Diamond Ring · 1.00 ct · GIA'),
    'S-PR-4219':    ('Rings',      'Pink Diamond Band · 18K Gold'),
    'S-PR-4220':    ('Rings',      'Pink Diamond Band · 18K Gold'),
    'S-PR-4221':    ('Rings',      'Pink Diamond Band · 18K Gold'),
    'S-PR-4222':    ('Rings',      'Pink Diamond Band · 18K Gold'),
    'S-YBR-4245':   ('Bangles',    'Multi-Colour Diamond Line Bracelet'),
    'S-YER-4103':   ('Jewellery',  'Fancy Yellow Diamond Kite Earrings'),
    'S-YER-4256':   ('Bangles',    'Multi-Colour Diamond Bangle'),
    'S-YR-3375':    ('Necklaces',  'Fancy Yellow Diamond Cluster Pendant'),
    'S-YR-4165':    ('Rings',      'Fancy Brown Diamond Band'),
    'S-YR-4233':    ('Rings',      'Multi-Colour Diamond Open Ring'),
}

COLOURS = {
    'FLY': 'Fancy Light Yellow', 'FY': 'Fancy Yellow', 'FIY': 'Fancy Intense Yellow',
    'FYY': 'Fancy Yellow', 'FBP': 'Fancy Brownish Pink', 'FIOP': 'Fancy Intense Orangy Pink',
    'FP-B': 'Fancy Pink', 'FBROWN': 'Fancy Brown', 'PINK': 'Pink',
    'W-X': 'Natural Light Yellow', 'Y-Z': 'Natural Light Yellow',
    'MIX COLOUR': 'Mixed fancy colours', 'MIX COLOR': 'Mixed fancy colours', 'MIX': 'Mixed fancy colours',
    'YELLOW': 'Yellow', 'FY (FANCY YELLOW)': 'Fancy Yellow',
    # supplier shorthand for the pavé on JC3S-G058: pink rounds and white rounds
    'P RD': 'Pink', 'F RD': 'White',
}
WHITE = {'FG', 'F-G', 'GH', 'G-H', 'HI', 'H-I', 'EF', 'IJ', 'F', 'G', 'H', 'LC', 'WD'}


def colour_name(code):
    c = (code or '').strip().upper()
    if c in COLOURS:
        return COLOURS[c]
    if c in WHITE:
        return 'White (%s)' % c.replace('-', '–')
    return code.strip() if code else ''


def slug(s):
    s = re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
    return re.sub(r'-+', '-', s)


def extract_images(z):
    """SKU -> bytes, via the drawing anchors in column D."""
    rels = dict(re.findall(r'Id="([^"]+)"[^>]*Target="([^"]+)"',
                           z.read('xl/drawings/_rels/drawing1.xml.rels').decode()))
    d = z.read('xl/drawings/drawing1.xml').decode()
    out = []
    for a in re.findall(r'<xdr:(?:one|two)CellAnchor>.*?</xdr:(?:one|two)CellAnchor>', d, re.S):
        row = int(re.search(r'<xdr:row>(\d+)</xdr:row>', a).group(1)) + 1
        tgt = rels[re.search(r'r:embed="([^"]+)"', a).group(1)].replace('../', 'xl/')
        out.append((row, tgt))
    return sorted(out)


def main():
    z = zipfile.ZipFile(XLSX)
    anchors = extract_images(z)
    ws = openpyxl.load_workbook(XLSX, data_only=True).active
    heads = [r for r in range(1, ws.max_row + 1) if str(ws.cell(r, 1).value).strip() == 'Sr No.']

    records, report = [], []
    for i, h in enumerate(heads):
        end = heads[i + 1] if i + 1 < len(heads) else ws.max_row + 1
        m = h + 1
        g = lambda r, c: ws.cell(r, c).value
        sku = str(g(m, 3)).strip()
        cat, title = PIECES[sku]

        stones = []
        for r in range(m, end):
            if g(r, 11) or g(r, 12):
                stones.append({
                    'colour': colour_name(str(g(r, 11) or '')),
                    # the sheet carries stray typing marks in a few clarity cells
                    'clarity': str(g(r, 12) or '').strip().strip('`\'"'),
                    'pcs': g(r, 13),
                    'cts': g(r, 14),
                })
        gold = next((g(r, 14) for r in range(m, end)
                     if str(g(r, 9) or '').strip().lower() == '18k gold'), None)

        total_pcs = sum(int(s['pcs'] or 0) for s in stones)
        total_cts = round(sum(float(s['cts'] or 0) for s in stones), 2)

        # image
        tgt = next((t for (rw, t) in anchors if h <= rw < end), None)
        img_rel = None
        note = ''
        if tgt:
            tmp = '/tmp/_moz_img.jpg'
            open(tmp, 'wb').write(z.read(tgt))
            im = Image.open(tmp)
            if sku in BRAND_CARDS:
                note = 'supplier marketing card of another brand — not published'
            elif min(im.size) < MIN_SIDE:
                note = 'photo too small for web (%dx%d) — needs re-shoot' % im.size
            else:
                im = im.convert('RGB')
                if max(im.size) > 2000:
                    im.thumbnail((2000, 2000), Image.LANCZOS)
                name = 'c-%s.jpg' % slug(sku)
                im.save(os.path.join(OUT_IMG, name), 'JPEG', quality=82, optimize=True)
                img_rel = './assets/products/' + name

        rec = {
            'handle': slug(title + '-' + sku),
            'title': title,
            'category': cat,
            'images': [img_rel] if img_rel else [],
            'g': 'her',
            'sku': sku,
            'price': g(m, 15),
            'currency': 'USD',
            'metal': '18K Gold',
            'goldWeight': gold,
            'grossWeight': g(m, 5),
            'lab': (g(m, 7) or None),
            'cert': (str(g(m, 8)).strip() if g(m, 8) else None),
            'collection': (str(g(m, 2)).strip() if g(m, 2) and str(g(m, 2)).strip().upper()
                           not in ('RING', 'EARRING') else None),
            'stones': stones,
            'totalPcs': total_pcs,
            'totalCts': total_cts,
            'consignment': 1,
        }
        records.append(rec)
        report.append((sku, cat, rec['price'], 'photo OK' if img_rel else 'NO PHOTO — ' + note))

    # merge into the catalogue, replacing any earlier import of the same SKUs
    data = json.load(open(DATA))
    skus = {r['sku'] for r in records}
    data = [p for p in data if p.get('sku') not in skus]
    data = records + data
    json.dump(data, open(DATA, 'w'), ensure_ascii=False, indent=1)

    print('%d pieces imported, catalogue now %d entries\n' % (len(records), len(data)))
    for sku, cat, price, st in report:
        print('%-14s %-10s $%-8s %s' % (sku, cat, price, st))
    priced = sum(1 for r in records if r['price'])
    shown = sum(1 for r in records if r['images'])
    print('\npriced: %d/33   with photo: %d/33' % (priced, shown))


if __name__ == '__main__':
    main()
