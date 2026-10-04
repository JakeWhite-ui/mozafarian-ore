#!/usr/bin/env python3
"""Apply the reviewed RU/AR translation corrections to js/i18n.js.

Each pair must match exactly once — anything else aborts before writing, so a
drifted source string is a loud failure rather than a silent half-edit.
"""
import sys

PATH = "js/i18n.js"

FIXES = [
    # ---------- RUSSIAN ----------
    # "fine" in "fine jewellery" is a quality tier, not a texture. "Тонкие
    # украшения" reads as physically thin ones.
    ("'Fine Jewellery': 'Тонкие украшения'",
     "'Fine Jewellery': 'Ювелирные украшения'"),
    ("'shop.title': 'Тонкие украшения,<br><em>домом</em> и руками.'",
     "'shop.title': 'Ювелирные украшения —<br><em>домом</em>, вручную.'"),
    ("'Тонкие украшения, бриллианты и редкие камни",
     "'Изысканные украшения, бриллианты и редкие камни"),

    # A watch "reference" is a model number: артикул. "Референс" is a
    # mood-board image in Russian — wrong field entirely.
    ("'Reference': 'Референс'", "'Reference': 'Артикул'"),
    ("Если нужной вам референции здесь нет — скажите: тихий поиск и есть большая часть работы этого дома.",
     "Если нужного вам артикула здесь нет — скажите: дискретный поиск и есть значительная часть работы дома."),
    ("Nautilus на коже и усложнения, которые редко доходят до открытого рынка",
     "Nautilus на кожаном ремне и усложнения, которые редко попадают на открытый рынок"),

    # "Часы" is plural-only: "каждые часы" reads as "every hour".
    ("Каждые часы в бутике, их можно посмотреть в тот же день, с коробкой и документами, и подогнать по руке до того, как вы уйдёте.",
     "Каждая модель есть в бутике — можно посмотреть в тот же день, с коробкой и документами, браслет подгоняется по запястью до вашего ухода."),

    # "Переставить" = move something across the room. Remounting a stone is
    # "переоправить"; an atelier makes a sketch, it does not "draw".
    ("семейную реликвию, которую хотите переставить. Ателье рисует, вы утверждаете, изделие делают в Дубае — обычно за шесть-двенадцать недель",
     "фамильное украшение, которое хотите переоправить. Ателье создаёт эскиз, вы утверждаете, изделие изготавливается в Дубае — обычно шесть–двенадцать недель"),

    # A setting is crafted, not sketched; a stone is set (закрепить), not held.
    ("оправа, нарисованная для неё одной", "оправа, созданная для неё одной"),
    ("и лишь затем выбираем, как его держать", "и лишь затем выбираем, как его закрепить"),

    # Russian buttons take a verb, not a bare noun.
    ("'Enquire': 'Запрос'", "'Enquire': 'Узнать подробнее'"),
    ("'Enquire on WhatsApp': 'Запрос в WhatsApp'",
     "'Enquire on WhatsApp': 'Написать в WhatsApp'"),
    ("'Enquire about a piece': 'Спросить об изделии'",
     "'Enquire about a piece': 'Узнать об изделии'"),

    # Product photography is plural, and "to follow" is not "being prepared".
    ("'Photography to follow': 'Фотография готовится'",
     "'Photography to follow': 'Фотографии появятся позже'"),

    # "Кто знает" = who happens to know. The English means a connoisseur.
    ("для того, кто знает", "для того, кто понимает"),

    # ---------- ARABIC ----------
    # The arrow points away from the reading direction in RTL.
    ("'View all →': 'عرض الكل →'", "'View all →': 'عرض الكل ←'"),
    ("'Discover →': 'اكتشف →'", "'Discover →': 'اكتشف ←'"),

    # "دبل" is Egyptian/Levantine; Gulf luxury copy uses حلقات الزواج.
    ("خواتم خطوبة ودبل زفاف، مرصّعة بألماسٍ اختير من أجل وعدٍ واحد.",
     "خواتم خطوبة وحلقات زواج، مرصّعة بألماسٍ اختير لوعدٍ واحد."),
    ("'Wedding & couples\\' bands': 'دبل الزفاف والخواتم الثنائية'",
     "'Wedding & couples\\' bands': 'حلقات الزواج وخواتم الثنائية'"),

    # "الحرفة" is the trade in a workaday sense; this house sells mastery.
    ("'Craftsmanship': 'الحرفة'", "'Craftsmanship': 'براعة الصياغة'"),
    ("تناقلت هذه العائلة الحرفة قرنين من الزمان",
     "تناقلت هذه العائلة براعة الصياغة قرنين من الزمان"),
    ("سبعة أجيال من الحرفة — خواتم وأحجار نادرة",
     "سبعة أجيال من براعة الصياغة — خواتم وأحجار كريمة نادرة"),

    # "بشكل خاص" is a calque of "in a special way"; "privately" is بصورة خاصة.
    ("وسنرسل تفاصيلها وسعرها بشكل خاص", "وسنرسل تفاصيلها وسعرها بصورة خاصة"),
    ("وسنرسل تفاصيله بشكل خاص", "وسنرسل تفاصيله بصورة خاصة"),
    ("ويشارك فريقنا السعر والشهادة والتوفّر بشكل خاص",
     "ويُطلع فريقنا على السعر والشهادة والتوفّر بصورة خاصة"),

    # "للسؤال" is conversational; enquiries are للاستفسار.
    ("للسؤال عن أي قطعة تراها هنا", "للاستفسار عن أي قطعة تراها هنا"),
    ("وللسؤال عن خاتم رأيته هنا", "وللاستفسار عن خاتم رأيته هنا"),
]


def main():
    src = open(PATH, encoding="utf-8").read()
    errs = []
    for old, new in FIXES:
        n = src.count(old)
        if n != 1:
            errs.append("%d matches (want 1): %s" % (n, old[:70]))
    if errs:
        print("ABORT — source drifted:")
        for e in errs:
            print("  " + e)
        return 1
    for old, new in FIXES:
        src = src.replace(old, new, 1)
    open(PATH, "w", encoding="utf-8").write(src)
    print("applied %d fixes to %s" % (len(FIXES), PATH))
    return 0


if __name__ == "__main__":
    sys.exit(main())
