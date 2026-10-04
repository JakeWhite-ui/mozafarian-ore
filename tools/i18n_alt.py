#!/usr/bin/env python3
"""Add the missing image alt-text translations to js/i18n.js.

These are the `alt` strings on the editorial and lookbook photography. The
i18n layer already translates the alt attribute (ATTRS includes 'alt'), so the
only thing missing was the entries themselves — a screen reader in Russian or
Arabic was reading English picture captions.

'Rolex' is deliberately absent: brand names stay in Latin script.

Idempotent: it strips any block it previously inserted before inserting again.
"""
import re
import sys

PATH = "js/i18n.js"
MARK = "/* ---- image alt text (editorial & lookbook photography) ---- */"

ALT = {
    "Atelier":                  ("Ателье",                            "المشغل"),
    "Bespoke atelier":          ("Ателье индивидуального заказа",     "مشغل التصميم الخاص"),
    "Bracelet and rings":       ("Браслет и кольца",                  "سوار وخواتم"),
    "Coloured gemstone rings":  ("Кольца с цветными камнями",         "خواتم بأحجار كريمة ملوّنة"),
    "Coloured gemstones":       ("Цветные драгоценные камни",         "أحجار كريمة ملوّنة"),
    "Diamond drop earrings":    ("Серьги-подвески с бриллиантами",    "أقراط متدلّية بالألماس"),
    "Diamond earrings":         ("Серьги с бриллиантами",             "أقراط ألماس"),
    "Diamond flower earrings":  ("Серьги-цветы с бриллиантами",       "أقراط زهرية بالألماس"),
    "Diamond ring":             ("Кольцо с бриллиантами",             "خاتم ألماس"),
    "Diamond riviere necklace": ("Колье-ривьера с бриллиантами",      "عقد ريفيير بالألماس"),
    "Gents jewellery":          ("Мужские украшения",                 "مجوهرات رجالية"),
    "Gents ring":               ("Мужское кольцо",                    "خاتم رجالي"),
    "Gents ring with emerald":  ("Мужское кольцо с изумрудом",        "خاتم رجالي بالزمرّد"),
    "High jewellery":           ("Высокое ювелирное искусство",       "المجوهرات الراقية"),
    "Necklace":                 ("Колье",                             "عقد"),
    "Pendant necklace":         ("Колье с подвеской",                 "عقد بقلادة"),
    "Rare timepieces":          ("Редкие часы",                       "ساعات نادرة"),
    "Timepiece":                ("Часы",                              "ساعة"),
    "Timepiece and ring":       ("Часы и кольцо",                     "ساعة وخاتم"),
    "Timepiece on the wrist":   ("Часы на запястье",                  "ساعة على المعصم"),
    "Unique creations":         ("Уникальные изделия",                "إبداعات فريدة"),
    "Wedding bands":            ("Обручальные кольца",                "حلقات الزواج"),
}


def block(idx):
    body = "".join("      '%s': '%s',\n" % (k, ALT[k][idx]) for k in sorted(ALT))
    return "\n      %s\n%s" % (MARK, body.rstrip("\n"))


def strip_previous(src):
    """Remove any block this script inserted on an earlier run."""
    pat = re.compile(r"\n\s*" + re.escape(MARK) + r"\n(?:\s*'[^\n]*\n?)+")
    return pat.sub("", src)


def dict_bounds(src, label):
    """Character span of the body of `T.<label>`, which is the FIRST occurrence.

    The last entry of a dictionary has no trailing comma, so anchoring on
    '    },' overshoots into the next block — walk braces instead.
    """
    start = src.index("\n    %s: {" % label)
    open_brace = src.index("{", start)
    depth, i = 0, open_brace
    while i < len(src):
        if src[i] == "{":
            depth += 1
        elif src[i] == "}":
            depth -= 1
            if depth == 0:
                return open_brace + 1, i
        i += 1
    raise SystemExit("unbalanced braces after %s" % label)


def main():
    src = strip_previous(open(PATH, encoding="utf-8").read())

    for lang, idx in (("ar", 1), ("ru", 0)):      # back to front
        body_start, body_end = dict_bounds(src, lang)
        body = src[body_start:body_end]
        # the previous last entry needs a comma before we append after it
        tail = body.rstrip()
        if not tail.endswith(","):
            body = body[:body.rindex(tail[-1]) + 1] + ","
        else:
            body = tail
        src = src[:body_start] + body + block(idx) + "\n    " + src[body_end:]

    open(PATH, "w", encoding="utf-8").write(src)
    print("added %d alt keys to each of ru/ar" % len(ALT))


if __name__ == "__main__":
    sys.exit(main())
