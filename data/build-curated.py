# -*- coding: utf-8 -*-
"""Курирование каталога: снять неверные фото со старых карточек и завести
15 карточек часов, которые реально сняты на съёмке (см. отчёт сверки).

Названия определены визуально по фото. Референсы намеренно НЕ указаны там,
где их не видно на снимке — их подтверждает бутик.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, 'products.json')

# (название, металл/циферблат, [фото], пометка для клиента)
WATCHES = [
    ('Rolex Datejust 41',
     'Ice Blue Arabic Dial · Fluted Bezel · Jubilee Bracelet',
     ['004', '015', '023', '081', '105']),
    ('Rolex Sky-Dweller',
     'Oystersteel & White Gold · Blue Dial · Jubilee Bracelet',
     ['002', '051']),
    ('Rolex Sky-Dweller',
     'Oystersteel & White Gold · Green Dial · Jubilee Bracelet',
     ['031', '073', '080', '089', '095']),
    ('Rolex Sky-Dweller',
     '18ct Everose Gold · Black Dial',
     ['021', '034', '056']),
    ('Rolex Sky-Dweller',
     '18ct Everose Gold · Sundust Dial · Oyster Bracelet',
     ['026', '060', '084', '025']),
    ('Rolex Sky-Dweller',
     '18ct Yellow Gold · Blue Dial',
     ['048']),
    ('Rolex Day-Date 40',
     '18ct Yellow Gold · Champagne Dial · President Bracelet',
     ['036', '091']),
    ('Rolex Day-Date 40',
     '18ct Everose Gold · White Roman Dial · President Bracelet',
     ['040', '062', '094']),
    ('Rolex Cosmograph Daytona',
     '18ct White Gold · Panda Dial · Oysterflex Strap',
     ['019', '045', '087']),
    ('Audemars Piguet Royal Oak',
     '18ct Gold · Champagne Tapisserie Dial',
     ['003', '029', '072', '096']),
    ('Audemars Piguet Royal Oak Chronograph',
     '18ct Rose Gold · Blue Dial · Rubber Strap',
     ['006', '024', '039']),
    ('Audemars Piguet Royal Oak Chronograph',
     '18ct Rose Gold · Black Dial · Gold Bracelet',
     ['014', '020', '035', '061']),
    ('Patek Philippe Nautilus',
     '18ct Rose Gold · Brown Dial · Leather Strap',
     ['043', '063', '079', '103']),
    ('Patek Philippe',
     '18ct Rose Gold · Black Dial · Leather Strap',
     ['030', '037']),
    ('Patek Philippe',
     '18ct Gold · Silvered Moonphase Dial · Leather Strap',
     ['074', '085', '108']),
]


def slug(*parts):
    s = ' '.join(parts).lower()
    out = []
    for ch in s:
        if ch.isalnum():
            out.append(ch)
        elif ch in ' -·&':
            out.append('-')
    h = ''.join(out)
    while '--' in h:
        h = h.replace('--', '-')
    return h.strip('-')


def main():
    prods = json.load(open(P, encoding='utf-8'))

    # 1. снять фото со всех старых карточек — они не соответствуют названиям
    stripped = 0
    for x in prods:
        if x.get('images'):
            x['images'] = []
            stripped += 1
        x.pop('real', None)

    # 2. завести карточки реально снятых часов
    prods = [x for x in prods if not x.get('shot')]  # идемпотентность
    new = []
    for title, spec, nums in WATCHES:
        h = slug(title, spec.split('·')[0], nums[0])
        new.append({
            'handle': h,
            'title': f'{title} — {spec}',
            'category': 'Watches',
            'images': [f'./assets/products/moz-{n}.jpg' for n in nums],
            'g': 'him',
            'shot': 1,          # снято нашей съёмкой, фото подтверждено
            'spec': spec,
        })

    prods = new + prods
    json.dump(prods, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

    print('снято неверных фото с карточек:', stripped)
    print('заведено новых карточек часов:', len(new))
    print('всего товаров:', len(prods))
    print('с фото:', sum(1 for x in prods if x.get('images')))
    for n in new:
        print(f"  {len(n['images'])} фото · {n['title']}")


if __name__ == '__main__':
    main()
