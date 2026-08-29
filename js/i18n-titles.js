/* ============================================================
   Mozafarian — product titles in Russian and Arabic

   Two layers, on purpose:

   HAND — every piece a visitor can actually see (photographed or
   priced) plus the charms, written out properly. These are what the
   client will read first, so they are not left to a machine.

   RULES — the long tail. Those titles are formulaic ("18k white gold
   Diamond and Sapphire gents ring"), so they are parsed into metal,
   stones, audience and type and recomposed grammatically rather than
   swapped word for word.

   Anything the parser does not fully understand stays in English. That
   covers the SKU codes the catalogue is half made of (BOLDR-MQ,
   HPN1-BP, W108-NC) and every watch reference — Richard Mille, Patek
   Aquanaut, Rolex — which the trade quotes in Latin in any language.
   A half-translated title reads worse than an English one.
   ============================================================ */
(function () {
  'use strict';

  function norm(s) { return String(s).replace(/\s+/g, ' ').trim().replace(/\s*\.$/, ''); }

  /* ============================================================
     HAND-WRITTEN
     ============================================================ */
  var HAND = {
    /* ---- coloured-diamond collection (photographed / priced) ---- */
    'Estrella Lite — Fancy Light Yellow Diamond Star Ring': {
      ru: 'Estrella Lite — кольцо «Звезда» с фантазийным светло-жёлтым бриллиантом',
      ar: 'Estrella Lite — خاتم نجمة بألماس أصفر فاتح ملوّن' },
    'Fania — Pear-Cut Fancy Yellow Diamond Ring': {
      ru: 'Fania — кольцо с фантазийным жёлтым бриллиантом огранки «груша»',
      ar: 'Fania — خاتم بألماس أصفر ملوّن بقصّة الكمثرى' },
    'Nova — Cushion-Cut Fancy Yellow Diamond Ring': {
      ru: 'Nova — кольцо с фантазийным жёлтым бриллиантом огранки «кушон»',
      ar: 'Nova — خاتم بألماس أصفر ملوّن بقصّة الوسادة' },
    'Magic Wand — Fancy Yellow Diamond Star Drop Earrings': {
      ru: 'Magic Wand — серьги-подвески «Звезда» с фантазийными жёлтыми бриллиантами',
      ar: 'Magic Wand — أقراط نجمة متدلية بألماس أصفر ملوّن' },
    'Magic Wand — Fancy Yellow Diamond Star Earrings': {
      ru: 'Magic Wand — серьги «Звезда» с фантазийными жёлтыми бриллиантами',
      ar: 'Magic Wand — أقراط نجمة بألماس أصفر ملوّن' },
    'Helene — Fancy Light Yellow Diamond Ring': {
      ru: 'Helene — кольцо с фантазийным светло-жёлтым бриллиантом',
      ar: 'Helene — خاتم بألماس أصفر فاتح ملوّن' },
    'Daisy — Fancy Light Yellow Diamond Cluster Ring': {
      ru: 'Daisy — кольцо-кластер с фантазийными светло-жёлтыми бриллиантами',
      ar: 'Daisy — خاتم عنقودي بألماس أصفر فاتح ملوّن' },
    'Fancy Light Yellow Diamond Cluster Earrings': {
      ru: 'Серьги-кластеры с фантазийными светло-жёлтыми бриллиантами',
      ar: 'أقراط عنقودية بألماس أصفر فاتح ملوّن' },
    'Fancy Brownish Pink Diamond Pear Drop Earrings': {
      ru: 'Серьги-подвески с фантазийными коричнево-розовыми бриллиантами огранки «груша»',
      ar: 'أقراط متدلية بألماس وردي مائل للبني بقصّة الكمثرى' },
    'Fancy Intense Orangy Pink Diamond Tassel Earrings': {
      ru: 'Серьги-кисти с фантазийными насыщенными оранжево-розовыми бриллиантами',
      ar: 'أقراط شرّابة بألماس وردي برتقالي مكثّف' },
    'Fancy Yellow Diamond Cushion Line Bracelet': {
      ru: 'Браслет-дорожка с фантазийными жёлтыми бриллиантами огранки «кушон»',
      ar: 'سوار خطّي بألماس أصفر ملوّن بقصّة الوسادة' },
    'Fancy Yellow Diamond Star Bangle · 18K Rose Gold': {
      ru: 'Жёсткий браслет «Звезда» с фантазийными жёлтыми бриллиантами · розовое золото 750',
      ar: 'إسورة نجمة بألماس أصفر ملوّن · ذهب وردي عيار 18' },
    'Natural Light Yellow Diamond Star Drop Earrings': {
      ru: 'Серьги-подвески «Звезда» с природными светло-жёлтыми бриллиантами',
      ar: 'أقراط نجمة متدلية بألماس أصفر فاتح طبيعي' },
    'Natural Light Yellow Diamond Star Earrings': {
      ru: 'Серьги «Звезда» с природными светло-жёлтыми бриллиантами',
      ar: 'أقراط نجمة بألماس أصفر فاتح طبيعي' },
    'Fancy Light Yellow Diamond Cluster Studs': {
      ru: 'Серьги-пусеты с фантазийными светло-жёлтыми бриллиантами',
      ar: 'أقراط مسمارية عنقودية بألماس أصفر فاتح ملوّن' },
    'Fancy Yellow Diamond Butterfly Pendant': {
      ru: 'Подвеска «Бабочка» с фантазийными жёлтыми бриллиантами',
      ar: 'تعليقة فراشة بألماس أصفر ملوّن' },
    'Fancy Intense Yellow Diamond Cluster Ring': {
      ru: 'Кольцо-кластер с фантазийными насыщенными жёлтыми бриллиантами',
      ar: 'خاتم عنقودي بألماس أصفر مكثّف ملوّن' },
    'Natural Light Yellow Diamond Band': {
      ru: 'Кольцо-дорожка с природными светло-жёлтыми бриллиантами',
      ar: 'خاتم صفّ بألماس أصفر فاتح طبيعي' },
    'Fancy Pink Diamond Heart Ring · 1.02 ct · GIA': {
      ru: 'Кольцо «Сердце» с фантазийным розовым бриллиантом · 1.02 кар. · GIA',
      ar: 'خاتم قلب بألماس وردي ملوّن · 1.02 قيراط · GIA' },
    'Fancy Light Yellow Diamond Cushion Earrings · GIA': {
      ru: 'Серьги с фантазийными светло-жёлтыми бриллиантами огранки «кушон» · GIA',
      ar: 'أقراط بألماس أصفر فاتح ملوّن بقصّة الوسادة · GIA' },
    'Fancy Light Yellow Diamond Ring · 1.00 ct · GIA': {
      ru: 'Кольцо с фантазийным светло-жёлтым бриллиантом · 1.00 кар. · GIA',
      ar: 'خاتم بألماس أصفر فاتح ملوّن · 1.00 قيراط · GIA' },
    'Fancy Light Yellow Diamond Ring · 1.01 ct · GIA': {
      ru: 'Кольцо с фантазийным светло-жёлтым бриллиантом · 1.01 кар. · GIA',
      ar: 'خاتم بألماس أصفر فاتح ملوّن · 1.01 قيراط · GIA' },
    'Fancy Intense Yellow Diamond Ring · 1.00 ct · GIA': {
      ru: 'Кольцо с фантазийным насыщенным жёлтым бриллиантом · 1.00 кар. · GIA',
      ar: 'خاتم بألماس أصفر مكثّف ملوّن · 1.00 قيراط · GIA' },
    'Pink Diamond Band · 18K Gold': {
      ru: 'Кольцо-дорожка с розовыми бриллиантами · золото 750',
      ar: 'خاتم صفّ بألماس وردي · ذهب عيار 18' },
    'Multi-Colour Diamond Line Bracelet': {
      ru: 'Браслет-дорожка с разноцветными бриллиантами',
      ar: 'سوار خطّي بألماس متعدد الألوان' },
    'Fancy Yellow Diamond Kite Earrings': {
      ru: 'Серьги с фантазийными жёлтыми бриллиантами огранки «кайт»',
      ar: 'أقراط بألماس أصفر ملوّن بقصّة الكايت' },
    'Multi-Colour Diamond Bangle': {
      ru: 'Жёсткий браслет с разноцветными бриллиантами',
      ar: 'إسورة بألماس متعدد الألوان' },
    'Fancy Yellow Diamond Cluster Pendant': {
      ru: 'Подвеска-кластер с фантазийными жёлтыми бриллиантами',
      ar: 'تعليقة عنقودية بألماس أصفر ملوّن' },
    'Fancy Brown Diamond Band': {
      ru: 'Кольцо-дорожка с фантазийными коричневыми бриллиантами',
      ar: 'خاتم صفّ بألماس بني ملوّن' },
    'Multi-Colour Diamond Open Ring': {
      ru: 'Открытое кольцо с разноцветными бриллиантами',
      ar: 'خاتم مفتوح بألماس متعدد الألوان' },

    /* ---- timepieces: model names stay Latin, the description turns ---- */
    'Rolex Datejust 41 — Ice Blue Arabic Dial · Fluted Bezel · Jubilee Bracelet': {
      ru: 'Rolex Datejust 41 — циферблат Ice Blue с арабскими цифрами · рифлёный безель · браслет Jubilee',
      ar: 'Rolex Datejust 41 — مينا أزرق ثلجي بأرقام عربية · إطار مضلّع · سوار Jubilee' },
    'Rolex Sky-Dweller — Oystersteel & White Gold · Blue Dial · Jubilee Bracelet': {
      ru: 'Rolex Sky-Dweller — сталь Oystersteel и белое золото · синий циферблат · браслет Jubilee',
      ar: 'Rolex Sky-Dweller — فولاذ Oystersteel وذهب أبيض · مينا أزرق · سوار Jubilee' },
    'Rolex Sky-Dweller — Oystersteel & White Gold · Green Dial · Jubilee Bracelet': {
      ru: 'Rolex Sky-Dweller — сталь Oystersteel и белое золото · зелёный циферблат · браслет Jubilee',
      ar: 'Rolex Sky-Dweller — فولاذ Oystersteel وذهب أبيض · مينا أخضر · سوار Jubilee' },
    'Rolex Sky-Dweller — 18ct Everose Gold · Black Dial': {
      ru: 'Rolex Sky-Dweller — золото Everose 750 · чёрный циферблат',
      ar: 'Rolex Sky-Dweller — ذهب Everose عيار 18 · مينا أسود' },
    'Rolex Sky-Dweller — 18ct Everose Gold · Sundust Dial · Oyster Bracelet': {
      ru: 'Rolex Sky-Dweller — золото Everose 750 · циферблат Sundust · браслет Oyster',
      ar: 'Rolex Sky-Dweller — ذهب Everose عيار 18 · مينا Sundust · سوار Oyster' },
    'Rolex Sky-Dweller — 18ct Yellow Gold · Blue Dial': {
      ru: 'Rolex Sky-Dweller — жёлтое золото 750 · синий циферблат',
      ar: 'Rolex Sky-Dweller — ذهب أصفر عيار 18 · مينا أزرق' },
    'Rolex Day-Date 40 — 18ct Yellow Gold · Champagne Dial · President Bracelet': {
      ru: 'Rolex Day-Date 40 — жёлтое золото 750 · циферблат «шампань» · браслет President',
      ar: 'Rolex Day-Date 40 — ذهب أصفر عيار 18 · مينا شامبانيا · سوار President' },
    'Rolex Day-Date 40 — 18ct Everose Gold · White Roman Dial · President Bracelet': {
      ru: 'Rolex Day-Date 40 — золото Everose 750 · белый циферблат с римскими цифрами · браслет President',
      ar: 'Rolex Day-Date 40 — ذهب Everose عيار 18 · مينا أبيض بأرقام رومانية · سوار President' },
    'Rolex Cosmograph Daytona — 18ct White Gold · Panda Dial · Oysterflex Strap': {
      ru: 'Rolex Cosmograph Daytona — белое золото 750 · циферблат «панда» · ремень Oysterflex',
      ar: 'Rolex Cosmograph Daytona — ذهب أبيض عيار 18 · مينا باندا · حزام Oysterflex' },
    'Audemars Piguet Royal Oak — 18ct Gold · Champagne Tapisserie Dial': {
      ru: 'Audemars Piguet Royal Oak — золото 750 · циферблат Tapisserie цвета шампань',
      ar: 'Audemars Piguet Royal Oak — ذهب عيار 18 · مينا Tapisserie بلون الشامبانيا' },
    'Audemars Piguet Royal Oak Chronograph — 18ct Rose Gold · Blue Dial · Rubber Strap': {
      ru: 'Audemars Piguet Royal Oak Chronograph — розовое золото 750 · синий циферблат · каучуковый ремень',
      ar: 'Audemars Piguet Royal Oak Chronograph — ذهب وردي عيار 18 · مينا أزرق · حزام مطاطي' },
    'Audemars Piguet Royal Oak Chronograph — 18ct Rose Gold · Black Dial · Gold Bracelet': {
      ru: 'Audemars Piguet Royal Oak Chronograph — розовое золото 750 · чёрный циферблат · золотой браслет',
      ar: 'Audemars Piguet Royal Oak Chronograph — ذهب وردي عيار 18 · مينا أسود · سوار ذهبي' },
    'Patek Philippe Nautilus — 18ct Rose Gold · Brown Dial · Leather Strap': {
      ru: 'Patek Philippe Nautilus — розовое золото 750 · коричневый циферблат · кожаный ремень',
      ar: 'Patek Philippe Nautilus — ذهب وردي عيار 18 · مينا بني · حزام جلدي' },
    'Patek Philippe — 18ct Rose Gold · Black Dial · Leather Strap': {
      ru: 'Patek Philippe — розовое золото 750 · чёрный циферблат · кожаный ремень',
      ar: 'Patek Philippe — ذهب وردي عيار 18 · مينا أسود · حزام جلدي' },
    'Patek Philippe — 18ct Gold · Silvered Moonphase Dial · Leather Strap': {
      ru: 'Patek Philippe — золото 750 · серебристый циферблат с фазой луны · кожаный ремень',
      ar: 'Patek Philippe — ذهب عيار 18 · مينا فضي بمؤشر أطوار القمر · حزام جلدي' },

    /* ---- charms: each one is a name, not a description ---- */
    'UK Flag Charm':        { ru: 'Шарм «Флаг Великобритании»', ar: 'دلاية علم بريطانيا' },
    'Pomegranate Charm':    { ru: 'Шарм «Гранат»',              ar: 'دلاية الرمّان' },
    'Crown Charm':          { ru: 'Шарм «Корона»',              ar: 'دلاية التاج' },
    'Hamsa Hand Charm':     { ru: 'Шарм «Рука Хамса»',          ar: 'دلاية كف الخميسة' },
    'Book Charm':           { ru: 'Шарм «Книга»',               ar: 'دلاية الكتاب' },
    'Farvahar Charm':       { ru: 'Шарм «Фаравахар»',           ar: 'دلاية الفروهر' },
    'Cyrus Cylinder Charm': { ru: 'Шарм «Цилиндр Кира»',        ar: 'دلاية أسطوانة كورش' },
    'Football Charm':       { ru: 'Шарм «Футбольный мяч»',      ar: 'دلاية كرة القدم' },
    'Euphoria':             { ru: 'Euphoria',                   ar: 'Euphoria' }
  };

  /* ============================================================
     RULES
     ============================================================ */

  // Watch references are quoted in Latin by the trade in every language.
  var KEEP_LATIN = /richard mille|patek|rolex|cartier|hublot|audemars|piguet|aquanaut|nautilus|tourbillon|daytona|datejust|day-?date|sky-?dweller|royal oak|calatrava|\bref\.|\brm ?\d|\bmm\b|\bdial\b|\bbezel\b|automatic|self-?winding|quartz|chronograph|skeleton|\bap\b/i;

  // noun, its Russian gender (for the adjective), and the Arabic adjective forms
  var TYPES = [
    { re: /\bsets?$/i,                  ru: 'Комплект',           g: 'm',  ar: 'طقم',        arM: 'رجالي',  arF: 'نسائي' },
    { re: /\bwedding\s+band\b/i,       ru: 'Обручальное кольцо', g: 'n',  ar: 'دبلة زفاف',  arM: 'رجالية', arF: 'نسائية' },
    { re: /\bearrings?\b|\bstuds?\b/i, ru: 'Серьги',             g: 'pl', ar: 'أقراط',      arM: 'رجالية', arF: 'نسائية' },
    { re: /\bnecklaces?\b/i,           ru: 'Колье',              g: 'n',  ar: 'قلادة',      arM: 'رجالية', arF: 'نسائية' },
    { re: /\bbangles?\b/i,             ru: 'Жёсткий браслет',    g: 'm',  ar: 'إسورة',      arM: 'رجالية', arF: 'نسائية' },
    { re: /\bbracelets?\b/i,           ru: 'Браслет',            g: 'm',  ar: 'سوار',       arM: 'رجالي',  arF: 'نسائي' },
    { re: /\bpendants?\b/i,            ru: 'Подвеска',           g: 'f',  ar: 'تعليقة',     arM: 'رجالية', arF: 'نسائية' },
    { re: /\bcharms?\b/i,              ru: 'Шарм',               g: 'm',  ar: 'دلاية',      arM: 'رجالية', arF: 'نسائية' },
    { re: /\bcufflinks?\b/i,           ru: 'Запонки',            g: 'pl', ar: 'أزرار أكمام', arM: 'رجالية', arF: 'نسائية' },
    { re: /\bbrooch(es)?\b/i,          ru: 'Брошь',              g: 'f',  ar: 'بروش',       arM: 'رجالي',  arF: 'نسائي' },
    { re: /\bsets?\b/i,                ru: 'Комплект',           g: 'm',  ar: 'طقم',        arM: 'رجالي',  arF: 'نسائي' },
    { re: /\brings?\b/i,               ru: 'Кольцо',             g: 'n',  ar: 'خاتم',       arM: 'رجالي',  arF: 'نسائي' },
    { re: /\bbands?\b/i,               ru: 'Кольцо-дорожка',     g: 'n',  ar: 'خاتم صفّ',   arM: 'رجالي',  arF: 'نسائي' }
  ];

  var AUDIENCE = [
    { re: /\b(gents?|gent's|men'?s|mens)\b/i, ru: { m: 'Мужской', f: 'Мужская', n: 'Мужское', pl: 'Мужские' }, ar: 'M' },
    { re: /\b(ladies|ladie's|lady'?s|women'?s|womens)\b/i, ru: { m: 'Женский', f: 'Женская', n: 'Женское', pl: 'Женские' }, ar: 'F' },
    { re: /\bunisex\b/i, ru: null, ru_suffix: ' унисекс', ar_suffix: ' للجنسين' }
  ];

  // longest first — "blue topaz" must win over "topaz"
  var STONES = [
    { re: /\bblack diamonds?\b/i,   ru: 'чёрными бриллиантами',  ar: 'الألماس الأسود' },
    { re: /\bblue topaz\b/i,        ru: 'голубыми топазами',     ar: 'التوباز الأزرق' },
    { re: /\bblue sapphires?\b/i,   ru: 'синими сапфирами',      ar: 'الياقوت الأزرق' },
    { re: /\bgreen sapphires?\b/i,  ru: 'зелёными сапфирами',    ar: 'الياقوت الأخضر' },
    { re: /\byellow sapphires?\b/i, ru: 'жёлтыми сапфирами',     ar: 'الياقوت الأصفر' },
    { re: /\bmother of pearl\b/i,   ru: 'перламутром',           ar: 'الصدف' },
    { re: /\bdiamonds?\b/i,         ru: 'бриллиантами',          ar: 'الألماس' },
    { re: /\bsapphires?\b/i,        ru: 'сапфирами',             ar: 'الياقوت الأزرق' },
    { re: /\brub(y|ies)\b/i,        ru: 'рубинами',              ar: 'الياقوت الأحمر' },
    { re: /\bemeralds?\b/i,         ru: 'изумрудами',            ar: 'الزمرد' },
    { re: /\btanzanites?\b/i,       ru: 'танзанитами',           ar: 'التنزانيت' },
    { re: /\bturquoise\b/i,         ru: 'бирюзой',               ar: 'الفيروز' },
    { re: /\bcitrines?\b/i,         ru: 'цитринами',             ar: 'السيترين' },
    { re: /\biolites?\b/i,          ru: 'иолитами',              ar: 'الأيوليت' },
    { re: /\bonyx\b/i,              ru: 'ониксом',               ar: 'الأونيكس' },
    { re: /\b(agate|aget)\b/i,      ru: 'агатом',                ar: 'العقيق' },
    { re: /\bamethysts?\b/i,        ru: 'аметистами',            ar: 'الجمشت' },
    { re: /\btopaz\b/i,             ru: 'топазами',              ar: 'التوباز' },
    { re: /\bpearls?\b/i,           ru: 'жемчугом',              ar: 'اللؤلؤ' }
  ];

  var METALS = [
    { re: /\bwhite\s*&\s*rose gold\b|\bwhite and rose gold\b/i,   ru: 'белое и розовое золото', ar: 'ذهب أبيض ووردي' },
    { re: /\bwhite\s*&\s*yellow gold\b|\bwhite yellow gold\b/i,   ru: 'белое и жёлтое золото',  ar: 'ذهب أبيض وأصفر' },
    { re: /\byellow\s*&\s*white gold\b/i,                          ru: 'жёлтое и белое золото',  ar: 'ذهب أصفر وأبيض' },
    { re: /\btri[- ]?(color|colour|gold)\s*gold\b|\btri color gold\b/i, ru: 'трёхцветное золото', ar: 'ذهب ثلاثي اللون' },
    { re: /\btwo[- ]?tone\s*(18k\s*)?gold\b/i,                     ru: 'двухцветное золото',     ar: 'ذهب ثنائي اللون' },
    { re: /\bwhite gold\b/i,                                       ru: 'белое золото',           ar: 'ذهب أبيض' },
    { re: /\byellow gold\b/i,                                      ru: 'жёлтое золото',          ar: 'ذهب أصفر' },
    { re: /\brose gold\b/i,                                        ru: 'розовое золото',         ar: 'ذهب وردي' },
    { re: /\bplatinum\b/i,                                         ru: 'платина',                ar: 'بلاتين' },
    { re: /\bgold\b/i,                                             ru: 'золото',                 ar: 'ذهب' }
  ];

  // karat marks read as the Russian assay standard; Arabic keeps عيار
  var KARAT = { '8': '333', '9': '375', '14': '585', '18': '750', '21': '875', '22': '916', '24': '999' };

  // a word that changes what the piece IS, appended to the noun
  var TYPE_MODS = [
    { re: /\bfull eternity\b/i,       ru: '-дорожка «вечность»', ar: ' صفّ كامل' },
    { re: /\bsolitaire\b/i,           ru: '-солитер',            ar: ' بحجر منفرد' },
    { re: /\bclusters?\b/i,           ru: '-кластер',            ar: ' عنقودي', arPl: ' عنقودية' },
    { re: /\b(drop|dangling)\b/i,     ru: '-подвески',           ar: ' متدلية', onlyFor: 'Серьги' },
    { re: /\bstuds?\b/i,              ru: '-пусеты',             ar: ' مسمارية', onlyFor: 'Серьги' }
  ];

  // adjective in front, gendered in Russian, annexed in Arabic
  var PREFIXES = [
    { re: /\bengagement\b/i, ru: { m: 'Помолвочный', f: 'Помолвочная', n: 'Помолвочное', pl: 'Помолвочные' }, ar: ' خطوبة' },
    { re: /\bart deco\b/i,   ruTail: ' в стиле ар-деко',    ar: ' بطراز آرت ديكو' },
    { re: /\bvintage[- ]inspired\b/i, ruTail: ' в винтажном стиле', ar: ' بطراز كلاسيكي' },
    { re: /\bstatement\b/i,  ru: { m: 'Крупный', f: 'Крупная', n: 'Крупное', pl: 'Крупные' }, ar: ' لافت' },
    { re: /\bopen\b/i,       ru: { m: 'Открытый', f: 'Открытая', n: 'Открытое', pl: 'Открытые' }, ar: ' مفتوح' }
  ];

  // decoration. "halo" describes the stones and reads on from them; the rest
  // are separate features and take a comma, so the sentence does not end up
  // with two "с" phrases running into each other.
  var MOTIFS = [
    { re: /\b(flower|floral)\b/i,   ru: 'с цветочным мотивом',   ar: 'بتصميم زهري' },
    { re: /\bbutterfly\b/i,         ru: 'с мотивом бабочки',     ar: 'بتصميم فراشة' },
    { re: /\bhearts?\b/i,           ru: 'с мотивом сердца',      ar: 'بتصميم القلب' },
    { re: /\bswirl\b/i,             ru: 'с завитком',            ar: 'بتصميم حلزوني' },
    { re: /\bhalo\b/i,              ru: 'в ореоле',              ar: 'بهالة', attach: true },
    { re: /\barrow\b/i,             ru: 'с мотивом стрелы',      ar: 'بتصميم السهم' }
  ];

  var CUTS = [
    { re: /\bemerald[- ]cut\b/i,     ru: 'огранки «изумруд»',  ar: 'بقصّة الزمرد' },
    { re: /\bpear([- ]shaped)?\b/i,  ru: 'огранки «груша»',    ar: 'بقصّة الكمثرى' },
    { re: /\bmarquise\b/i,           ru: 'огранки «маркиз»',   ar: 'بقصّة الماركيز' },
    { re: /\boval\b/i,               ru: 'овальной огранки',   ar: 'بقصّة بيضاوية' },
    { re: /\bcushion\b/i,            ru: 'огранки «кушон»',    ar: 'بقصّة الوسادة' },
    { re: /\bbriolette\b/i,          ru: 'огранки «бриолет»',  ar: 'بقصّة البريوليت' },
    { re: /\btrillion\b/i,           ru: 'огранки «триллион»', ar: 'بقصّة المثلث' },
    { re: /\bround\b/i,              ru: 'круглой огранки',    ar: 'بقصّة مستديرة' }
  ];

  function lower(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

  function translate(title, lang) {
    var src = norm(title);
    if (!src) return null;

    var hand = HAND[src];
    if (hand && hand[lang]) return hand[lang];

    if (lang !== 'ru' && lang !== 'ar') return null;
    if (KEEP_LATIN.test(src)) return null;

    // what is it? no noun we recognise — most often a bare SKU — leave it alone
    var type = null;
    for (var i = 0; i < TYPES.length; i++) {
      if (TYPES[i].re.test(src)) { type = TYPES[i]; break; }
    }
    if (!type) return null;

    var g = type.g;
    var isPl = g === 'pl';

    // audience
    var aud = null;
    for (var a = 0; a < AUDIENCE.length; a++) if (AUDIENCE[a].re.test(src)) { aud = AUDIENCE[a]; break; }

    var work = src;

    // The cut comes off first: "Emerald cut" is a shape, and left in place the
    // stone rules read it as an emerald and set the ring with one.
    var cut = null;
    for (var c = 0; c < CUTS.length; c++) {
      if (CUTS[c].re.test(work)) { cut = CUTS[c]; work = work.replace(CUTS[c].re, ' '); break; }
    }

    // Stones, in the order they are written. Each match is cut out of the
    // working copy so a broader rule cannot claim it again — otherwise
    // "Blue Topaz" is read a second time by the plain "topaz" rule and the
    // piece ends up set with "голубыми топазами и топазами".
    var stones = [];
    STONES.forEach(function (s) {
      if (!s.re.test(work)) return;
      stones.push({ at: work.search(s.re), ru: s.ru, ar: s.ar });
      work = work.replace(s.re, ' ');
    });
    stones.sort(function (x, y) { return x.at - y.at; });

    // metal + karat
    var metal = null;
    for (var mi = 0; mi < METALS.length; mi++) if (METALS[mi].re.test(src)) { metal = METALS[mi]; break; }
    var kt = src.match(/\b(\d{1,2})\s*(?:k|kt|ct)\b/i);
    var karat = kt ? kt[1] : null;

    var mod = null;
    for (var d = 0; d < TYPE_MODS.length; d++) {
      var t = TYPE_MODS[d];
      if (t.re.test(src) && (!t.onlyFor || t.onlyFor === type.ru)) { mod = t; break; }
    }
    var prefix = null;
    for (var p = 0; p < PREFIXES.length; p++) if (PREFIXES[p].re.test(src)) { prefix = PREFIXES[p]; break; }
    var motif = null;
    for (var mo = 0; mo < MOTIFS.length; mo++) if (MOTIFS[mo].re.test(src)) { motif = MOTIFS[mo]; break; }

    if (lang === 'ru') {
      var noun = type.ru + (mod ? mod.ru : '');
      var head = '';
      if (aud && aud.ru) { head = aud.ru[g] + ' '; noun = lower(noun); }
      if (prefix && prefix.ru) {
        var pw = prefix.ru[g];
        if (head) { head += lower(pw) + ' '; } else { head = pw + ' '; noun = lower(noun); }
      }
      var out = head + noun;
      if (prefix && prefix.ruTail) out += prefix.ruTail;
      if (aud && aud.ru_suffix) out += aud.ru_suffix;
      if (stones.length) {
        var list = stones.map(function (s) { return s.ru; });
        out += ' с ' + (list.length > 1 ? list.slice(0, -1).join(', ') + ' и ' + list[list.length - 1] : list[0]);
      }
      if (cut) out += ' ' + cut.ru;
      if (motif) out += (motif.attach || !stones.length ? ' ' : ', ') + motif.ru;
      if (metal) out += ' · ' + metal.ru + (karat && KARAT[karat] ? ' ' + KARAT[karat] : '');
      return out;
    }

    // Arabic: noun, then its adjectives, then the stones, then the metal
    var arOut = type.ar + (mod ? (isPl && mod.arPl ? mod.arPl : mod.ar) : '');
    if (prefix && prefix.ar) arOut += prefix.ar;
    if (aud) {
      if (aud.ar === 'M') arOut += ' ' + type.arM;
      else if (aud.ar === 'F') arOut += ' ' + type.arF;
      else if (aud.ar_suffix) arOut += aud.ar_suffix;
    }
    if (stones.length) {
      arOut += ' ' + stones.map(function (s, i) { return (i === 0 ? 'ب' : 'و') + s.ar; }).join(' ');
    }
    if (cut) arOut += ' ' + cut.ar;
    if (motif) arOut += ' ' + motif.ar;
    if (metal) arOut += ' · ' + metal.ar + (karat ? ' عيار ' + karat : '');
    return arOut;
  }

  window.MOZ_TITLES = { translate: translate, hand: HAND };
})();
