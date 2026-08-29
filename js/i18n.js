/* ============================================================
   Mozafarian — trilingual layer (English · Русский · العربية)

   The site is static HTML with markup generated at runtime by
   shell.js and catalog.js, so translation is keyed by the English
   source string and applied to text nodes as they appear. A
   MutationObserver covers everything the scripts inject later —
   the menu, the footer, catalogue cards, the product page.

   Headlines that are broken across <em>/<br> carry a data-i18n
   token instead: translating their fragments one by one would
   scramble the word order in Russian and Arabic.

   Loaded in <head>, before the body is parsed, so the first paint
   is already in the chosen language.
   ============================================================ */
(function () {
  'use strict';

  var LANGS = [
    { code: 'en', label: 'EN', name: 'English', dir: 'ltr', htmlLang: 'en' },
    { code: 'ru', label: 'RU', name: 'Русский', dir: 'ltr', htmlLang: 'ru' },
    { code: 'ar', label: 'AR', name: 'العربية', dir: 'rtl', htmlLang: 'ar' }
  ];
  var STORAGE = 'moz.lang';
  var DEFAULT = 'en';

  /* ============================================================
     1. PHRASES — keyed by the English source text
     ============================================================ */
  var T = {
    ru: {
      /* ---- navigation, shell, footer ---- */
      'MENU': 'МЕНЮ',
      'CLOSE': 'ЗАКРЫТЬ',
      'Home': 'Главная',
      'High Jewellery': 'Высокое ювелирное искусство',
      'Jewellery': 'Украшения',
      'For Her': 'Для неё',
      'For Him': 'Для него',
      'Engagement & Bridal': 'Помолвка и свадьба',
      'Watches': 'Часы',
      'The House': 'О доме',
      'Boutiques': 'Бутики',
      'Collections': 'Коллекции',
      'Shop by category': 'По категориям',
      'Rings': 'Кольца',
      'Necklaces & Pendants': 'Колье и подвески',
      'Earrings': 'Серьги',
      'Bracelets & Bangles': 'Браслеты',
      'Timepieces': 'Часы',
      'View all': 'Все изделия',
      'Explore': 'Разделы',
      'Client Services': 'Клиентский сервис',
      'Book a private viewing': 'Записаться на частный показ',
      'Contact us': 'Связаться с нами',
      'Fine jewellers since 1821. Seven generations, two homes — Dubai & London.':
        'Ювелирный дом с 1821 года. Семь поколений, два дома — Дубай и Лондон.',
      'Sofitel Obelisk, Wafi City, Dubai': 'Sofitel Obelisk, Wafi City, Дубай',
      '1 Knightsbridge Green, London': '1 Knightsbridge Green, Лондон',
      '© 2026 Mozafarian Jewellers': '© 2026 Mozafarian Jewellers',
      'Dubai & London': 'Дубай и Лондон',
      'Wafi City, Dubai': 'Wafi City, Дубай',
      'Knightsbridge, London': 'Knightsbridge, Лондон',
      'WhatsApp': 'WhatsApp',

      /* ---- landing ---- */
      'Mozafarian — Fine Jewellers Since 1821 · Dubai & London':
        'Mozafarian — ювелирный дом с 1821 года · Дубай и Лондон',
      'DRAG': 'ТЯНИТЕ',
      'Fine Jewellers Since 1821': 'Ювелирный дом с 1821 года',
      'From Neuchâtel to Persia to Dubai — a family house crafting diamonds, rare gemstones and 18-karat gold into pieces made to be worn for a lifetime.':
        'От Невшателя через Персию в Дубай — семейный дом, обращающий бриллианты, редкие камни и золото 750-й пробы в украшения, которые носят всю жизнь.',
      'Explore the Collections': 'Смотреть коллекции',
      'Book a Private Viewing': 'Записаться на частный показ',
      'Scroll': 'Листайте',
      'HERITAGE': 'НАСЛЕДИЕ',
      'The house is founded': 'Год основания дома',
      'Generations of the family': 'Поколений семьи',
      'Houses — Dubai & London': 'Дома — Дубай и Лондон',
      'COLLECTIONS': 'КОЛЛЕКЦИИ',
      'The Collections': 'Коллекции',
      'Drag to explore': 'Тяните, чтобы листать',
      'Light and shadow, drawn in diamond': 'Свет и тень, начертанные бриллиантом',
      'Warm gold, worn every day': 'Тёплое золото на каждый день',
      'The line of the region, reimagined': 'Линия региона в новом прочтении',
      'Pieces carried close, for meaning': 'Украшения, что носят близко к сердцу',
      'High jewellery, without compromise': 'Высокое ювелирное искусство без компромиссов',
      'Best Seller': 'Выбор клиентов',
      '18K White Gold · Diamond & Sapphire Square Cluster':
        'Белое золото 750 · бриллианты и сапфиры, квадратный кластер',
      'Metal': 'Металл',
      '18K White Gold': 'Белое золото 750',
      'Stones': 'Камни',
      'Diamond · Sapphire': 'Бриллиант · сапфир',
      'Availability': 'Наличие',
      'On request': 'По запросу',
      'Enquire About This Piece': 'Узнать об изделии',
      'The Maison': 'Дом',
      '— The Mozafarian family': '— Семья Mozafarian',
      'Bespoke': 'Индивидуальный заказ',
      'Book on WhatsApp': 'Записаться в WhatsApp',
      'Write to us': 'Написать нам',
      'Dubai': 'Дубай',
      'London': 'Лондон',
      'Sofitel Obelisk, Wafi City, Dubai — UAE': 'Sofitel Obelisk, Wafi City, Дубай — ОАЭ',
      '1 Knightsbridge Green, London SW1X 7NE': '1 Knightsbridge Green, Лондон SW1X 7NE',
      '© 2026 Mozafarian Jewellers — Dubai & London': '© 2026 Mozafarian Jewellers — Дубай и Лондон',

      /* ---- High Jewellery ---- */
      'High Jewellery — Mozafarian · Since 1821': 'Высокое ювелирное искусство — Mozafarian · с 1821 года',
      'One-of-a-kind creations set with the finest white and coloured diamonds, emeralds, rubies and sapphires — offered privately.':
        'Изделия в единственном экземпляре с лучшими белыми и цветными бриллиантами, изумрудами, рубинами и сапфирами — предлагаются приватно.',
      'Enquire privately': 'Частный запрос',
      'Explore the catalogue': 'Смотреть каталог',
      'By Stone': 'По камню',
      'Diamonds, white & fancy': 'Бриллианты — белые и фантазийные',
      'Seven generations of buying stones teaches you to trust the eye before the certificate. Whites are chosen for life rather than paper grade; fancy yellows and pinks are taken only when the colour is worth the wait. Every stone is set here, by the hands that will finish it.':
        'Семь поколений закупки камней учат доверять глазу прежде сертификата. Белые мы выбираем для жизни, а не ради строки в бумаге; жёлтые и розовые берём лишь тогда, когда цвет стоит ожидания. Каждый камень закрепляют здесь — те же руки, что доведут изделие до конца.',
      'Discover': 'Подробнее',
      'Rare coloured gemstones': 'Редкие цветные камни',
      'Emerald, ruby and sapphire of real character are found, not ordered. When such a stone comes to us we hold it until the right setting — and the right owner — appears. Provenance is documented in full before anything is offered.':
        'Изумруд, рубин и сапфир с характером находят, а не заказывают. Когда такой камень приходит к нам, мы храним его, пока не появится верная оправа — и верный владелец. Происхождение документируется полностью, прежде чем что-либо будет предложено.',
      'Unique Creations': 'Уникальные изделия',
      'One of one': 'Единственное в своём роде',
      'One drawing, one owner, and nothing else like it. A commission begins with a conversation in the boutique and ends with a piece entered in the house\'s books under your name — never repeated, for anyone.':
        'Один эскиз, один владелец — и ничего подобного больше. Заказ начинается с разговора в бутике и заканчивается изделием, вписанным в книги дома на ваше имя. Оно не повторится ни для кого.',
      'Commission a piece': 'Заказать изделие',

      /* ---- Bridal ---- */
      'Engagement & Bridal — Mozafarian · Since 1821': 'Помолвка и свадьба — Mozafarian · с 1821 года',
      'Engagement rings and wedding bands, set with diamonds chosen for a single promise.':
        'Помолвочные кольца и обручальные пары с бриллиантами, выбранными ради одного обещания.',
      'Explore rings': 'Смотреть кольца',
      'Book an appointment': 'Записаться на приём',
      'Engagement': 'Помолвка',
      'Engagement rings': 'Помолвочные кольца',
      'A solitaire, a halo, or a setting drawn for her alone. We start with the stone — you see it loose, in daylight, before anything is decided — and only then choose how it should be held.':
        'Солитер, ореол или оправа, нарисованная для неё одной. Мы начинаем с камня — вы видите его отдельно, при дневном свете, до всяких решений — и лишь затем выбираем, как его держать.',
      'Wedding': 'Свадьба',
      'Wedding & couples\' bands': 'Обручальные и парные кольца',
      'Platinum and 18-karat gold, plain or set, made as a pair so the two sit together properly. Sized and engraved in the boutique, and re-polished for you free of charge for as long as you wear them.':
        'Платина и золото 750-й пробы, гладкие или с камнями, сделанные парой — чтобы сидеть друг с другом как должно. Размер и гравировка в бутике, полировка — бесплатно всё время, пока вы их носите.',
      'Create your own': 'Создать своё',
      'Bring a sketch, a photograph, or an heirloom you would like reset. Our atelier draws, you approve, and the piece is made in Dubai — usually within six to twelve weeks, depending on the stone.':
        'Принесите набросок, фотографию или семейную реликвию, которую хотите переставить. Ателье рисует, вы утверждаете, изделие делают в Дубае — обычно за шесть-двенадцать недель, в зависимости от камня.',
      'Begin a commission': 'Начать заказ',

      /* ---- Watches ---- */
      'Timepieces — Mozafarian · Since 1821': 'Часы — Mozafarian · с 1821 года',
      'A curated selection of the world\'s most sought-after watches — Rolex, Audemars Piguet and Patek Philippe, held in the boutique.':
        'Отобранная подборка самых желанных часов мира — Rolex, Audemars Piguet и Patek Philippe, в наличии в бутике.',
      'View the timepieces': 'Смотреть часы',
      'Enquire': 'Запрос',
      'Selected houses': 'Избранные дома',
      'Datejust, Day-Date, Sky-Dweller and Cosmograph Daytona — in Oystersteel, yellow gold and Everose. Each watch is in the boutique and can be seen the same day, with box and papers, and sized to your wrist before you leave.':
        'Datejust, Day-Date, Sky-Dweller и Cosmograph Daytona — в Oystersteel, жёлтом золоте и Everose. Каждые часы в бутике, их можно посмотреть в тот же день, с коробкой и документами, и подогнать по руке до того, как вы уйдёте.',
      'Audemars Piguet & Patek Philippe': 'Audemars Piguet и Patek Philippe',
      'Royal Oak in gold and rose gold, Nautilus on leather, and complications that rarely reach the open market. If the reference you want is not here, tell us — sourcing quietly is a large part of what this house does.':
        'Royal Oak в золоте и розовом золоте, Nautilus на коже и усложнения, которые редко доходят до открытого рынка. Если нужной вам референции здесь нет — скажите: тихий поиск и есть большая часть работы этого дома.',

      /* ---- The House ---- */
      'The House — Mozafarian · Since 1821': 'О доме — Mozafarian · с 1821 года',
      'In 1821 the family left Neuchâtel for Persia under royal patronage. A marriage gave the house its name — Mozafarian, “the victorious.” Seven generations on, we serve the world from Dubai and London.':
        'В 1821 году семья покинула Невшатель ради Персии под королевским покровительством. Брак дал дому имя — Mozafarian, «победоносный». Семь поколений спустя мы служим миру из Дубая и Лондона.',
      'Heritage': 'Наследие',
      'Seven generations': 'Семь поколений',
      'From Neuchâtel to the Persian court, and from Tehran to Dubai and London — the trade has been handed down in this family for two centuries. What passes with it is not a technique but a standard: nothing leaves the house that the previous generation would have refused.':
        'От Невшателя к персидскому двору, от Тегерана к Дубаю и Лондону — ремесло передаётся в этой семье два столетия. Вместе с ним передаётся не техника, а мера: из дома не выходит ничего, что отвергло бы предыдущее поколение.',
      'Craftsmanship': 'Мастерство',
      'The atelier': 'Ателье',
      'Drawing, setting and final polish happen under one roof, by artisans who have been with the house for decades. It is slower than sending the work out — and it is the only way we can promise that the piece in the window is the piece we made.':
        'Эскиз, закрепка и финальная полировка — под одной крышей, руками мастеров, что с домом десятилетиями. Это медленнее, чем отдавать работу на сторону, — и это единственный способ обещать: изделие в витрине сделано нами.',
      'Visit the boutiques': 'Посетить бутики',
      '— Sofitel Obelisk, Wafi City': '— Sofitel Obelisk, Wafi City',
      '— 1 Knightsbridge Green, SW1X 7NE': '— 1 Knightsbridge Green, SW1X 7NE',

      /* ---- Boutiques ---- */
      'Boutiques — Mozafarian · Dubai & London': 'Бутики — Mozafarian · Дубай и Лондон',
      'A stone is decided in the hand, not on a screen. Our two houses are open for private viewings — tell us what you are looking for and we will have it waiting.':
        'Камень выбирают в руке, а не на экране. Оба наших дома открыты для частных показов — скажите, что вы ищете, и мы приготовим это к вашему приходу.',
      'Sofitel Dubai The Obelisk': 'Sofitel Dubai The Obelisk',
      'United Arab Emirates': 'Объединённые Арабские Эмираты',
      'Telephone': 'Телефон',
      'Email': 'Эл. почта',
      'Viewings': 'Показы',
      'By appointment': 'По записи',
      'Directions': 'Как добраться',
      '1 Knightsbridge Green': '1 Knightsbridge Green',
      'London SW1X 7NE': 'Лондон SW1X 7NE',
      'United Kingdom': 'Великобритания',
      'Cannot come to us? We travel to clients across the Gulf and can bring a selection to you.':
        'Не можете приехать? Мы выезжаем к клиентам по странам Залива и привезём подборку к вам.',
      'Arrange an appointment': 'Договориться о встрече',

      /* ---- For Her / For Him ---- */
      'For Her — Mozafarian · Fine Jewellers Since 1821': 'Для неё — Mozafarian · ювелирный дом с 1821 года',
      'For Him — Mozafarian · Fine Jewellers Since 1821': 'Для него — Mozafarian · ювелирный дом с 1821 года',
      'The Collection': 'Коллекция',
      'Fine jewellery, diamonds and rare gemstones — chosen for the women who wear them. Every piece offered on request.':
        'Тонкие украшения, бриллианты и редкие камни — выбранные для тех, кто их носит. Каждое изделие предлагается по запросу.',
      'Gents\' rings, exceptional timepieces and diamonds with presence — for the man who knows. Every piece offered on request.':
        'Мужские кольца, исключительные часы и бриллианты с характером — для того, кто знает. Каждое изделие предлагается по запросу.',
      'The Lookbook': 'Лукбук',
      'Worn, not displayed.': 'Их носят, а не выставляют.',
      'Photographed in the boutique this season. To ask about any piece you see here, write to us and we will send its details and price privately.':
        'Снято в бутике в этом сезоне. Чтобы спросить о любом изделии отсюда, напишите нам — пришлём описание и цену приватно.',
      'Photographed in the boutique this season. The timepieces below are catalogued in full — for a ring you have seen here, write to us and we will send its details privately.':
        'Снято в бутике в этом сезоне. Часы ниже описаны в каталоге полностью; о кольце, которое вы здесь увидели, напишите нам — пришлём детали приватно.',
      'Enquire about a piece': 'Спросить об изделии',
      'Loading the collection…': 'Загружаем коллекцию…',

      /* ---- Jewellery hub / catalogue / product ---- */
      'Jewellery — Mozafarian · Fine Jewellers Since 1821': 'Украшения — Mozafarian · ювелирный дом с 1821 года',
      'From signature rings to rare timepieces — explore the maison by category, or view the full catalogue.':
        'От фирменных колец до редких часов — смотрите дом по категориям или откройте полный каталог.',
      'Loading categories…': 'Загружаем категории…',
      'The Catalogue — Mozafarian · Fine Jewellers Since 1821': 'Каталог — Mozafarian · ювелирный дом с 1821 года',
      'The Catalogue': 'Каталог',
      'Seven generations of craftsmanship — rings, rare gemstones, bespoke gold and timepieces. Every piece is offered on request; our team shares pricing, certification and availability privately.':
        'Семь поколений мастерства — кольца, редкие камни, золото на заказ и часы. Каждое изделие предлагается по запросу; цену, сертификацию и наличие мы сообщаем приватно.',
      'Loading the catalogue…': 'Загружаем каталог…',
      'Piece — Mozafarian · Fine Jewellers Since 1821': 'Изделие — Mozafarian · ювелирный дом с 1821 года',
      'Catalogue': 'Каталог',
      'Piece': 'Изделие',
      'Loading…': 'Загрузка…',
      'You may also admire': 'Возможно, вам понравится',
      'View all →': 'Все изделия →',
      'View all pieces': 'Все изделия',
      'Fine Jewellery': 'Тонкие украшения',
      'Bangles': 'Жёсткие браслеты',
      'Bracelets': 'Браслеты',
      'Necklaces': 'Колье',
      'Charms': 'Шармы',
      'Sets': 'Комплекты',
      'All': 'Все',
      'Discover →': 'Смотреть →',
      'Price on request': 'Цена по запросу',
      'Photography to follow': 'Фотография готовится',
      'Maison': 'Дом',
      'Mozafarian · Since 1821': 'Mozafarian · с 1821 года',
      'Reference': 'Референс',
      'Category': 'Категория',
      'Diamonds': 'Бриллианты',
      'Total weight': 'Общий вес',
      'Certificate': 'Сертификат',
      'In the boutique': 'В бутике',
      'Enquire on WhatsApp': 'Запрос в WhatsApp',
      'Back to catalogue': 'Вернуться в каталог',
      'Piece not found.': 'Изделие не найдено.',
      'This piece is offered on request. Our team will share pricing, certification and availability, and can arrange a private viewing at our Dubai or London boutique.':
        'Изделие предлагается по запросу. Мы сообщим цену, сертификацию и наличие и организуем частный показ в бутике в Дубае или Лондоне.',
      'Retail price excludes duties. This piece is held in the boutique and can be seen the same day — we will confirm availability and arrange a private viewing in Dubai or London.':
        'Розничная цена указана без пошлин. Изделие находится в бутике, его можно посмотреть в тот же день — мы подтвердим наличие и организуем частный показ в Дубае или Лондоне.',
      'pdp.conv': 'Розничная цена {usd} · пересчёт по фиксированному курсу {rate} AED за доллар, с округлением.',

      /* ---- assembled at runtime by catalog.js (see I18N.t) ---- */
      '{n} pieces': function (p) { return p.n + ' ' + ruPlural(p.n, 'изделие', 'изделия', 'изделий'); },
      'archive.rest': 'Ещё <strong>{pieces}</strong> хранятся в бутике и сейчас снимаются. ' +
        '<a href="{all}">Открыть полный каталог</a> или ' +
        '<a target="_blank" rel="noopener" href="{wa}">спросить о конкретном изделии</a>.',
      'archive.whole': 'Полная коллекция насчитывает <strong>{pieces}</strong>: они описаны и хранятся в бутике, пока идёт съёмка. ' +
        '<a href="{all}">Посмотреть всю коллекцию</a> или ' +
        '<a target="_blank" rel="noopener" href="{wa}">спросить об изделии</a>.',
      'Catalogue unavailable.': 'Каталог недоступен.',
      'Unavailable.': 'Недоступно.'
    },

    ar: {
      /* ---- navigation, shell, footer ---- */
      'MENU': 'القائمة',
      'CLOSE': 'إغلاق',
      'Home': 'الرئيسية',
      'High Jewellery': 'المجوهرات الراقية',
      'Jewellery': 'المجوهرات',
      'For Her': 'لها',
      'For Him': 'له',
      'Engagement & Bridal': 'الخطوبة والزفاف',
      'Watches': 'الساعات',
      'The House': 'عن الدار',
      'Boutiques': 'البوتيكات',
      'Collections': 'المجموعات',
      'Shop by category': 'تسوّق حسب الفئة',
      'Rings': 'الخواتم',
      'Necklaces & Pendants': 'القلائد والدلايات',
      'Earrings': 'الأقراط',
      'Bracelets & Bangles': 'الأساور',
      'Timepieces': 'الساعات',
      'View all': 'عرض الكل',
      'Explore': 'استكشف',
      'Client Services': 'خدمات العملاء',
      'Book a private viewing': 'حجز عرض خاص',
      'Contact us': 'تواصل معنا',
      'Fine jewellers since 1821. Seven generations, two homes — Dubai & London.':
        'دار مجوهرات راقية منذ عام 1821. سبعة أجيال، وداران — دبي ولندن.',
      'Sofitel Obelisk, Wafi City, Dubai': 'سوفيتيل أوبيليسك، وافي سيتي، دبي',
      '1 Knightsbridge Green, London': '1 نايتسبريدج غرين، لندن',
      '© 2026 Mozafarian Jewellers': '© 2026 مجوهرات مظفريان',
      'Dubai & London': 'دبي ولندن',
      'Wafi City, Dubai': 'وافي سيتي، دبي',
      'Knightsbridge, London': 'نايتسبريدج، لندن',
      'WhatsApp': 'واتساب',

      /* ---- landing ---- */
      'Mozafarian — Fine Jewellers Since 1821 · Dubai & London':
        'مظفريان — دار مجوهرات راقية منذ 1821 · دبي ولندن',
      'DRAG': 'اسحب',
      'Fine Jewellers Since 1821': 'دار مجوهرات راقية منذ عام 1821',
      'From Neuchâtel to Persia to Dubai — a family house crafting diamonds, rare gemstones and 18-karat gold into pieces made to be worn for a lifetime.':
        'من نوشاتيل إلى بلاد فارس فدبي — دارٌ عائلية تصوغ الألماس والأحجار النادرة والذهب عيار 18 قطعًا تُلبس مدى العمر.',
      'Explore the Collections': 'استكشف المجموعات',
      'Book a Private Viewing': 'احجز عرضًا خاصًا',
      'Scroll': 'مرّر',
      'HERITAGE': 'الإرث',
      'The house is founded': 'عام تأسيس الدار',
      'Generations of the family': 'أجيال من العائلة',
      'Houses — Dubai & London': 'داران — دبي ولندن',
      'COLLECTIONS': 'المجموعات',
      'The Collections': 'المجموعات',
      'Drag to explore': 'اسحب للاستكشاف',
      'Light and shadow, drawn in diamond': 'ضوءٌ وظل، مرسومان بالألماس',
      'Warm gold, worn every day': 'ذهبٌ دافئ، يُلبس كل يوم',
      'The line of the region, reimagined': 'خطُّ المنطقة، بروحٍ جديدة',
      'Pieces carried close, for meaning': 'قطعٌ تُحمل قريبةً من القلب، لمعنى',
      'High jewellery, without compromise': 'مجوهرات راقية بلا مساومة',
      'Best Seller': 'الأكثر طلبًا',
      '18K White Gold · Diamond & Sapphire Square Cluster':
        'ذهب أبيض عيار 18 · عنقود مربّع من الألماس والياقوت الأزرق',
      'Metal': 'المعدن',
      '18K White Gold': 'ذهب أبيض عيار 18',
      'Stones': 'الأحجار',
      'Diamond · Sapphire': 'ألماس · ياقوت أزرق',
      'Availability': 'التوفّر',
      'On request': 'عند الطلب',
      'Enquire About This Piece': 'استفسر عن هذه القطعة',
      'The Maison': 'الدار',
      '— The Mozafarian family': '— عائلة مظفريان',
      'Bespoke': 'التصميم الخاص',
      'Book on WhatsApp': 'احجز عبر واتساب',
      'Write to us': 'راسلنا',
      'Dubai': 'دبي',
      'London': 'لندن',
      'Sofitel Obelisk, Wafi City, Dubai — UAE': 'سوفيتيل أوبيليسك، وافي سيتي، دبي — الإمارات',
      '1 Knightsbridge Green, London SW1X 7NE': '1 نايتسبريدج غرين، لندن SW1X 7NE',
      '© 2026 Mozafarian Jewellers — Dubai & London': '© 2026 مجوهرات مظفريان — دبي ولندن',

      /* ---- High Jewellery ---- */
      'High Jewellery — Mozafarian · Since 1821': 'المجوهرات الراقية — مظفريان · منذ 1821',
      'One-of-a-kind creations set with the finest white and coloured diamonds, emeralds, rubies and sapphires — offered privately.':
        'إبداعات فريدة مرصّعة بأجود أنواع الألماس الأبيض والملوّن والزمرد والياقوت — تُعرض بشكل خاص.',
      'Enquire privately': 'استفسار خاص',
      'Explore the catalogue': 'تصفّح الكتالوج',
      'By Stone': 'حسب الحجر',
      'Diamonds, white & fancy': 'الألماس، الأبيض والملوّن',
      'Seven generations of buying stones teaches you to trust the eye before the certificate. Whites are chosen for life rather than paper grade; fancy yellows and pinks are taken only when the colour is worth the wait. Every stone is set here, by the hands that will finish it.':
        'سبعة أجيال من شراء الأحجار تعلّمك أن تثق بالعين قبل الشهادة. نختار الأبيض ليُلبس مدى العمر لا ليُقرأ على ورق؛ ولا نأخذ الأصفر والوردي النادرين إلا حين يستحق اللون الانتظار. كل حجر يُرصَّع هنا، بالأيدي نفسها التي ستُنهي القطعة.',
      'Discover': 'اكتشف',
      'Rare coloured gemstones': 'أحجار كريمة ملوّنة نادرة',
      'Emerald, ruby and sapphire of real character are found, not ordered. When such a stone comes to us we hold it until the right setting — and the right owner — appears. Provenance is documented in full before anything is offered.':
        'الزمرد والياقوت ذو الحضور الحقيقي يُعثر عليه ولا يُطلب. حين يصلنا حجر كهذا نحتفظ به حتى يظهر التصميم المناسب — والمالك المناسب. ويُوثَّق مصدره كاملًا قبل أن يُعرض.',
      'Unique Creations': 'إبداعات فريدة',
      'One of one': 'واحدة لا ثانية لها',
      'One drawing, one owner, and nothing else like it. A commission begins with a conversation in the boutique and ends with a piece entered in the house\'s books under your name — never repeated, for anyone.':
        'رسمٌ واحد، ومالكٌ واحد، ولا مثيل لها. يبدأ الطلب بحديث في البوتيك وينتهي بقطعة تُقيَّد في سجلات الدار باسمك — لا تُكرَّر لأحد بعدك.',
      'Commission a piece': 'اطلب قطعة خاصة',

      /* ---- Bridal ---- */
      'Engagement & Bridal — Mozafarian · Since 1821': 'الخطوبة والزفاف — مظفريان · منذ 1821',
      'Engagement rings and wedding bands, set with diamonds chosen for a single promise.':
        'خواتم خطوبة ودبل زفاف، مرصّعة بألماسٍ اختير من أجل وعدٍ واحد.',
      'Explore rings': 'استكشف الخواتم',
      'Book an appointment': 'احجز موعدًا',
      'Engagement': 'الخطوبة',
      'Engagement rings': 'خواتم الخطوبة',
      'A solitaire, a halo, or a setting drawn for her alone. We start with the stone — you see it loose, in daylight, before anything is decided — and only then choose how it should be held.':
        'حجر منفرد، أو هالة، أو تصميم يُرسم لها وحدها. نبدأ من الحجر — تراه مفردًا في ضوء النهار قبل أي قرار — ثم نختار كيف يُحتضن.',
      'Wedding': 'الزفاف',
      'Wedding & couples\' bands': 'دبل الزفاف والخواتم الثنائية',
      'Platinum and 18-karat gold, plain or set, made as a pair so the two sit together properly. Sized and engraved in the boutique, and re-polished for you free of charge for as long as you wear them.':
        'بلاتين وذهب عيار 18، سادة أو مرصّع، يُصاغان معًا ليتناسبا تمامًا. نضبط المقاس والنقش في البوتيك، ونعيد التلميع مجانًا ما دمتما ترتديانهما.',
      'Create your own': 'اصنع تصميمك',
      'Bring a sketch, a photograph, or an heirloom you would like reset. Our atelier draws, you approve, and the piece is made in Dubai — usually within six to twelve weeks, depending on the stone.':
        'أحضر رسمًا أو صورة أو قطعة موروثة ترغب في إعادة صياغتها. يرسم أتيليهنا، وتوافق أنت، وتُصنع القطعة في دبي — عادةً خلال ستة إلى اثني عشر أسبوعًا حسب الحجر.',
      'Begin a commission': 'ابدأ طلبك الخاص',

      /* ---- Watches ---- */
      'Timepieces — Mozafarian · Since 1821': 'الساعات — مظفريان · منذ 1821',
      'A curated selection of the world\'s most sought-after watches — Rolex, Audemars Piguet and Patek Philippe, held in the boutique.':
        'مجموعة منتقاة من أكثر ساعات العالم طلبًا — رولكس وأوديمار بيغيه وباتيك فيليب، متوفرة في البوتيك.',
      'View the timepieces': 'شاهد الساعات',
      'Enquire': 'استفسر',
      'Selected houses': 'دور مختارة',
      'Datejust, Day-Date, Sky-Dweller and Cosmograph Daytona — in Oystersteel, yellow gold and Everose. Each watch is in the boutique and can be seen the same day, with box and papers, and sized to your wrist before you leave.':
        'ديت جست وداي-ديت وسكاي-دويلر وكوزموغراف دايتونا — بفولاذ أويستر والذهب الأصفر وإيفروز. كل ساعة موجودة في البوتيك ويمكن رؤيتها في اليوم نفسه، بعلبتها وأوراقها، وتُضبط على معصمك قبل أن تغادر.',
      'Audemars Piguet & Patek Philippe': 'أوديمار بيغيه وباتيك فيليب',
      'Royal Oak in gold and rose gold, Nautilus on leather, and complications that rarely reach the open market. If the reference you want is not here, tell us — sourcing quietly is a large part of what this house does.':
        'رويال أوك بالذهب والذهب الوردي، وناوتيلوس بسوار جلدي، وتعقيدات نادرًا ما تصل إلى السوق المفتوح. إن لم يكن الموديل الذي تريده هنا فأخبرنا — فالبحث بهدوء جزء كبير مما تتقنه هذه الدار.',

      /* ---- The House ---- */
      'The House — Mozafarian · Since 1821': 'عن الدار — مظفريان · منذ 1821',
      'In 1821 the family left Neuchâtel for Persia under royal patronage. A marriage gave the house its name — Mozafarian, “the victorious.” Seven generations on, we serve the world from Dubai and London.':
        'في عام 1821 غادرت العائلة نوشاتيل إلى بلاد فارس برعاية ملكية. ومن مصاهرةٍ نالت الدار اسمها — مظفريان، أي «المنتصر». وبعد سبعة أجيال، نخدم العالم من دبي ولندن.',
      'Heritage': 'الإرث',
      'Seven generations': 'سبعة أجيال',
      'From Neuchâtel to the Persian court, and from Tehran to Dubai and London — the trade has been handed down in this family for two centuries. What passes with it is not a technique but a standard: nothing leaves the house that the previous generation would have refused.':
        'من نوشاتيل إلى البلاط الفارسي، ومن طهران إلى دبي ولندن — تناقلت هذه العائلة الحرفة قرنين من الزمان. وما يُتوارث ليس تقنية بل معيارًا: لا يخرج من الدار ما كان الجيل السابق ليرفضه.',
      'Craftsmanship': 'الحرفة',
      'The atelier': 'الأتيليه',
      'Drawing, setting and final polish happen under one roof, by artisans who have been with the house for decades. It is slower than sending the work out — and it is the only way we can promise that the piece in the window is the piece we made.':
        'الرسم والترصيع والتلميع النهائي يجري تحت سقف واحد، بأيدي حرفيين رافقوا الدار عقودًا. هذا أبطأ من إرسال العمل إلى الخارج — وهو الطريق الوحيد لنعدك بأن القطعة في الواجهة هي القطعة التي صنعناها.',
      'Visit the boutiques': 'زر البوتيكات',
      '— Sofitel Obelisk, Wafi City': '— سوفيتيل أوبيليسك، وافي سيتي',
      '— 1 Knightsbridge Green, SW1X 7NE': '— 1 نايتسبريدج غرين، SW1X 7NE',

      /* ---- Boutiques ---- */
      'Boutiques — Mozafarian · Dubai & London': 'البوتيكات — مظفريان · دبي ولندن',
      'A stone is decided in the hand, not on a screen. Our two houses are open for private viewings — tell us what you are looking for and we will have it waiting.':
        'الحجر يُختار في اليد لا على الشاشة. بوتيكانا مفتوحان للعروض الخاصة — أخبرنا بما تبحث عنه وسنُعدّه بانتظارك.',
      'Sofitel Dubai The Obelisk': 'سوفيتيل دبي ذا أوبيليسك',
      'United Arab Emirates': 'الإمارات العربية المتحدة',
      'Telephone': 'الهاتف',
      'Email': 'البريد الإلكتروني',
      'Viewings': 'العروض',
      'By appointment': 'بموعد مسبق',
      'Directions': 'الاتجاهات',
      '1 Knightsbridge Green': '1 نايتسبريدج غرين',
      'London SW1X 7NE': 'لندن SW1X 7NE',
      'United Kingdom': 'المملكة المتحدة',
      'Cannot come to us? We travel to clients across the Gulf and can bring a selection to you.':
        'لا تستطيع الحضور؟ نسافر إلى عملائنا في أنحاء الخليج ويمكننا إحضار مجموعة مختارة إليك.',
      'Arrange an appointment': 'حدّد موعدًا',

      /* ---- For Her / For Him ---- */
      'For Her — Mozafarian · Fine Jewellers Since 1821': 'لها — مظفريان · دار مجوهرات منذ 1821',
      'For Him — Mozafarian · Fine Jewellers Since 1821': 'له — مظفريان · دار مجوهرات منذ 1821',
      'The Collection': 'المجموعة',
      'Fine jewellery, diamonds and rare gemstones — chosen for the women who wear them. Every piece offered on request.':
        'مجوهرات راقية وألماس وأحجار نادرة — اختيرت لمن ترتديها. كل قطعة تُعرض عند الطلب.',
      'Gents\' rings, exceptional timepieces and diamonds with presence — for the man who knows. Every piece offered on request.':
        'خواتم رجالية وساعات استثنائية وألماس ذو حضور — لمن يعرف. كل قطعة تُعرض عند الطلب.',
      'The Lookbook': 'دفتر الإطلالات',
      'Worn, not displayed.': 'تُلبس، لا تُعرض.',
      'Photographed in the boutique this season. To ask about any piece you see here, write to us and we will send its details and price privately.':
        'صُوّرت في البوتيك هذا الموسم. للسؤال عن أي قطعة تراها هنا، راسلنا وسنرسل تفاصيلها وسعرها بشكل خاص.',
      'Photographed in the boutique this season. The timepieces below are catalogued in full — for a ring you have seen here, write to us and we will send its details privately.':
        'صُوّرت في البوتيك هذا الموسم. الساعات أدناه مُدرجة في الكتالوج كاملةً — وللسؤال عن خاتم رأيته هنا، راسلنا وسنرسل تفاصيله بشكل خاص.',
      'Enquire about a piece': 'استفسر عن قطعة',
      'Loading the collection…': 'جارٍ تحميل المجموعة…',

      /* ---- Jewellery hub / catalogue / product ---- */
      'Jewellery — Mozafarian · Fine Jewellers Since 1821': 'المجوهرات — مظفريان · دار مجوهرات منذ 1821',
      'From signature rings to rare timepieces — explore the maison by category, or view the full catalogue.':
        'من الخواتم المميّزة إلى الساعات النادرة — تصفّح الدار حسب الفئة أو اطّلع على الكتالوج كاملًا.',
      'Loading categories…': 'جارٍ تحميل الفئات…',
      'The Catalogue — Mozafarian · Fine Jewellers Since 1821': 'الكتالوج — مظفريان · دار مجوهرات منذ 1821',
      'The Catalogue': 'الكتالوج',
      'Seven generations of craftsmanship — rings, rare gemstones, bespoke gold and timepieces. Every piece is offered on request; our team shares pricing, certification and availability privately.':
        'سبعة أجيال من الحرفة — خواتم وأحجار نادرة وذهب حسب الطلب وساعات. كل قطعة تُعرض عند الطلب؛ ويشارك فريقنا السعر والشهادة والتوفّر بشكل خاص.',
      'Loading the catalogue…': 'جارٍ تحميل الكتالوج…',
      'Piece — Mozafarian · Fine Jewellers Since 1821': 'قطعة — مظفريان · دار مجوهرات منذ 1821',
      'Catalogue': 'الكتالوج',
      'Piece': 'قطعة',
      'Loading…': 'جارٍ التحميل…',
      'You may also admire': 'قد يعجبك أيضًا',
      'View all →': 'عرض الكل →',
      'View all pieces': 'كل القطع',
      'Fine Jewellery': 'المجوهرات الراقية',
      'Bangles': 'الأساور الصلبة',
      'Bracelets': 'الأساور',
      'Necklaces': 'القلائد',
      'Charms': 'التعليقات',
      'Sets': 'الأطقم',
      'All': 'الكل',
      'Discover →': 'اكتشف →',
      'Price on request': 'السعر عند الطلب',
      'Photography to follow': 'الصورة قريبًا',
      'Maison': 'الدار',
      'Mozafarian · Since 1821': 'مظفريان · منذ 1821',
      'Reference': 'المرجع',
      'Category': 'الفئة',
      'Diamonds': 'الألماس',
      'Total weight': 'الوزن الإجمالي',
      'Certificate': 'الشهادة',
      'In the boutique': 'متوفرة في البوتيك',
      'Enquire on WhatsApp': 'استفسر عبر واتساب',
      'Back to catalogue': 'العودة إلى الكتالوج',
      'Piece not found.': 'القطعة غير موجودة.',
      'This piece is offered on request. Our team will share pricing, certification and availability, and can arrange a private viewing at our Dubai or London boutique.':
        'تُعرض هذه القطعة عند الطلب. سيشارك فريقنا السعر والشهادة والتوفّر، ويمكنه ترتيب عرض خاص في بوتيك دبي أو لندن.',
      'Retail price excludes duties. This piece is held in the boutique and can be seen the same day — we will confirm availability and arrange a private viewing in Dubai or London.':
        'السعر لا يشمل الرسوم. القطعة محفوظة في البوتيك ويمكن رؤيتها في اليوم نفسه — سنؤكد التوفّر ونرتّب عرضًا خاصًا في دبي أو لندن.',
      'pdp.conv': 'السعر بالدولار {usd} · محوّل بسعر الصرف الثابت {rate} درهم للدولار، مع التقريب.',

      /* ---- assembled at runtime by catalog.js (see I18N.t) ---- */
      '{n} pieces': function (p) { return arCount(p.n, 'قطعة واحدة', 'قطعتان', 'قطع', 'قطعة'); },
      'archive.rest': 'وهناك <strong>{pieces}</strong> أخرى محفوظة في البوتيك ويجري تصويرها. ' +
        '<a href="{all}">اطّلع على الكتالوج كاملًا</a> أو ' +
        '<a target="_blank" rel="noopener" href="{wa}">استفسر عن قطعة بعينها</a>.',
      'archive.whole': 'تضم المجموعة الكاملة <strong>{pieces}</strong>، مُدرجة ومحفوظة في البوتيك ريثما يكتمل التصوير. ' +
        '<a href="{all}">تصفّح المجموعة كاملة</a> أو ' +
        '<a target="_blank" rel="noopener" href="{wa}">استفسر عن قطعة</a>.',
      'Catalogue unavailable.': 'الكتالوج غير متاح.',
      'Unavailable.': 'غير متاح.'
    }
  };

  /* ============================================================
     2. HEADLINES — kept whole, because they carry inline <em>/<br>
        and the word order moves in translation.
        Keyed by data-i18n on the element.
     ============================================================ */
  var H = {
    ru: {
      'hero.title': '<span class="line"><span>Семь поколений</span></span><span class="line"><span>ювелирного <em>искусства.</em></span></span>',
      'featured.title': '<span class="line"><span>Кольцо ар-деко</span></span><span class="line"><span>с бриллиантами и сапфирами</span></span>',
      'maison.text': '<span class="line"><span>В 1821 году семья покинула Невшатель ради Персии</span></span><span class="line"><span>под королевским покровительством. Брак дал</span></span><span class="line"><span>дому его имя — <em>Mozafarian</em>, «победоносный».</span></span><span class="line"><span>Семь поколений спустя мы служим миру</span></span><span class="line"><span>из двух домов: Дубая и Лондона.</span></span>',
      'contact.title': '<span class="line"><span>Позвольте рассказать</span></span><span class="line"><span>вашу <em>историю.</em></span></span>',
      'hj.title': 'Самое редкое,<br><em>вручную.</em>',
      'bridal.title': 'Ради <em>мгновения</em><br>длиною в жизнь.',
      'watches.title': 'Время, которое <em>редко</em><br>задерживается.',
      'house.title': 'С <em>1821 года.</em>',
      'boutiques.title': 'Приходите и <em>смотрите.</em>',
      'forher.title': 'Для <em>неё.</em>',
      'forhim.title': 'Для <em>него.</em>',
      'shop.title': 'Тонкие украшения,<br><em>домом</em> и руками.',
      'jewellery.title': 'Смотреть по <em>категориям</em>.'
    },
    ar: {
      'hero.title': '<span class="line"><span>سبعة أجيال</span></span><span class="line"><span>من صناعة <em>المجوهرات.</em></span></span>',
      'featured.title': '<span class="line"><span>خاتم آرت ديكو</span></span><span class="line"><span>بالألماس والياقوت الأزرق</span></span>',
      'maison.text': '<span class="line"><span>في عام 1821 غادرت العائلة نوشاتيل إلى بلاد فارس</span></span><span class="line"><span>برعاية ملكية. ومن مصاهرةٍ نالت</span></span><span class="line"><span>الدار اسمها — <em>مظفريان</em>، أي «المنتصر».</span></span><span class="line"><span>وبعد سبعة أجيال، نخدم العالم</span></span><span class="line"><span>من دارين: دبي ولندن.</span></span>',
      'contact.title': '<span class="line"><span>دعنا نروي</span></span><span class="line"><span><em>حكايتك.</em></span></span>',
      'hj.title': 'الأندر،<br><em>بأيدٍ ماهرة.</em>',
      'bridal.title': 'من أجل <em>لحظة</em><br>العمر.',
      'watches.title': 'وقتٌ <em>قلّما</em><br>يُقتنى.',
      'house.title': 'منذ <em>عام 1821.</em>',
      'boutiques.title': 'تفضّل <em>وشاهد.</em>',
      'forher.title': '<em>لها.</em>',
      'forhim.title': '<em>له.</em>',
      'shop.title': 'مجوهرات راقية،<br>من <em>الدار</em> وبالأيدي.',
      'jewellery.title': 'تصفّح حسب <em>الفئة</em>.'
    }
  };

  /* ============================================================
     3. Patterns — text the scripts compose with a number in it
     ============================================================ */
  // Russian needs the right plural form, Arabic needs dual and the
  // 3–10 vs 11+ split; "12 pieces" is not a phrase you can look up.
  function ruPlural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }
  function arCount(n, one, two, few, many) {
    if (n === 1) return one;
    if (n === 2) return two;
    if (n % 100 >= 3 && n % 100 <= 10) return n + ' ' + few;
    return n + ' ' + many;
  }

  var PATTERNS = [
    {
      re: /^(\d+)\s+pieces?$/,
      ru: function (n) { return n + ' ' + ruPlural(n, 'изделие', 'изделия', 'изделий'); },
      ar: function (n) { return arCount(n, 'قطعة واحدة', 'قطعتان', 'قطع', 'قطعة'); }
    },
    {
      re: /^Load more \((\d+)\)$/,
      ru: function (n) { return 'Показать ещё (' + n + ')'; },
      ar: function (n) { return 'عرض المزيد (' + n + ')'; }
    }
  ];

  // Specification values are assembled from data ("18K White Gold · 4.83 g",
  // "PINK — 12 stones · 2.29 ct"). Substitutions run only inside the few
  // places that hold them, so catalogue titles — which stay in English,
  // they are the manufacturers' own names — are never half-translated.
  var SUB_SCOPE = '.pdp__specs .v, .cat-count, .hub-tile__count, .cat-more .btn, .card__price';
  var SUBS = {
    ru: [
      [/(\d+)\s+stones\b/g, function (m, n) { return n + ' ' + ruPlural(+n, 'камень', 'камня', 'камней'); }],
      [/(\d+)\s+stone\b/g, '$1 камень'],
      [/([\d.]+)\s+ct\b/g, '$1 кар.'],
      [/([\d.]+)\s+g\b/g, '$1 г'],
      [/\bWhite Gold\b/g, 'белое золото'],
      [/\bYellow Gold\b/g, 'жёлтое золото'],
      [/\bRose Gold\b/g, 'розовое золото'],
      [/\bPlatinum\b/g, 'платина'],
      [/\bGold\b/g, 'золото']
    ],
    ar: [
      [/(\d+)\s+stones\b/g, function (m, n) { return arCount(+n, 'حجر واحد', 'حجران', 'أحجار', 'حجرًا'); }],
      [/(\d+)\s+stone\b/g, 'حجر واحد'],
      [/([\d.]+)\s+ct\b/g, '$1 قيراط'],
      [/([\d.]+)\s+g\b/g, '$1 غ'],
      [/\bWhite Gold\b/g, 'ذهب أبيض'],
      [/\bYellow Gold\b/g, 'ذهب أصفر'],
      [/\bRose Gold\b/g, 'ذهب وردي'],
      [/\bPlatinum\b/g, 'بلاتين'],
      [/\bGold\b/g, 'ذهب']
    ]
  };

  /* ============================================================
     4. Engine
     ============================================================ */
  var lang = DEFAULT;
  var applying = false;
  var observer = null;

  function dict() { return T[lang] || null; }

  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  function lookup(src) {
    var d = dict();
    if (!d) return null;
    var key = norm(src);
    if (!key) return null;
    if (Object.prototype.hasOwnProperty.call(d, key)) return d[key];
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = key.match(PATTERNS[i].re);
      if (m && PATTERNS[i][lang]) return PATTERNS[i][lang](+m[1]);
    }
    return null;
  }

  function substitute(src) {
    var rules = SUBS[lang];
    if (!rules) return null;
    var out = src, hit = false;
    for (var i = 0; i < rules.length; i++) {
      var next = out.replace(rules[i][0], rules[i][1]);
      if (next !== out) { out = next; hit = true; }
    }
    return hit ? out : null;
  }

  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1 };

  // Piece names live in their own dictionary (js/i18n-titles.js): the catalogue
  // is the client's data, not site copy, and most of it stays in English.
  var TITLE_SCOPE = '.card__title, .pdp__title, .card__img, #pdpMain';

  function titleOf(src) {
    if (!window.MOZ_TITLES) return null;
    return window.MOZ_TITLES.translate(src, lang);
  }

  function translateText(node) {
    var parent = node.parentNode;
    if (!parent || SKIP_TAGS[parent.nodeName]) return;
    if (parent.closest && parent.closest('[data-i18n-skip]')) return;

    // The English source is recorded the first time we see the node, so a
    // switch back to English restores it exactly. If someone else has rewritten
    // the node since — the currency switch reformats prices in place — the
    // baseline is taken again, otherwise we would put the old price back.
    if (node.__src === undefined || (node.__out !== undefined && node.nodeValue !== node.__out)) {
      node.__src = node.nodeValue;
    }
    var src = node.__src;
    if (!norm(src)) return;

    var out = src;
    if (lang !== 'en') {
      var hit = lookup(src);
      if (hit === null && parent.matches && parent.matches(SUB_SCOPE)) hit = substitute(norm(src));
      if (hit === null && parent.matches && parent.matches(TITLE_SCOPE)) hit = titleOf(src);
      // the browser tab on a product page: "<piece> — Mozafarian"
      if (hit === null && parent.nodeName === 'TITLE') {
        var m = norm(src).match(/^(.+) — Mozafarian$/);
        var piece = m && titleOf(m[1]);
        if (piece) hit = piece + ' — Mozafarian';
      }
      if (hit !== null) {
        // keep the whitespace that surrounded the phrase in the markup
        var lead = (src.match(/^\s*/) || [''])[0];
        var tail = (src.match(/\s*$/) || [''])[0];
        out = lead + hit + tail;
      }
    }
    if (node.nodeValue !== out) node.nodeValue = out;
    node.__out = out;
  }

  var ATTRS = ['aria-label', 'placeholder', 'title', 'alt'];

  function translateEl(el) {
    // whole-headline replacement
    var token = el.getAttribute && el.getAttribute('data-i18n');
    if (token) {
      if (el.__srcHtml === undefined) el.__srcHtml = el.innerHTML;
      var html = (lang !== 'en' && H[lang] && H[lang][token]) || el.__srcHtml;
      if (el.innerHTML !== html) el.innerHTML = html;
    }
    if (!el.getAttribute) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (!el.hasAttribute(a)) continue;
      var store = '__attr_' + a;
      if (el[store] === undefined) el[store] = el.getAttribute(a);
      var val = el[store];
      if (lang !== 'en') {
        var hit = lookup(val);
        if (hit === null && a === 'alt' && el.matches(TITLE_SCOPE)) hit = titleOf(val);
        if (hit !== null) val = hit;
      }
      if (el.getAttribute(a) !== val) el.setAttribute(a, val);
    }
    // social + search description follows the page language
    if (el.nodeName === 'META') {
      var name = el.getAttribute('name') || el.getAttribute('property') || '';
      if (/description|og:title|og:locale/.test(name)) {
        if (el.__content === undefined) el.__content = el.getAttribute('content');
        var c = el.__content;
        if (lang !== 'en') {
          if (name === 'og:locale') c = lang === 'ru' ? 'ru_RU' : 'ar_AE';
          else { var h2 = lookup(c); if (h2 !== null) c = h2; }
        }
        if (el.getAttribute('content') !== c) el.setAttribute('content', c);
      }
    }
  }

  function walk(root) {
    if (root.nodeType === 3) { translateText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) {
      if (SKIP_TAGS[root.nodeName]) return;
      translateEl(root);
      if (root.getAttribute && root.getAttribute('data-i18n')) return; // handled whole
    }
    var el = root.querySelectorAll ? root.querySelectorAll('*') : [];
    for (var i = 0; i < el.length; i++) {
      if (SKIP_TAGS[el[i].nodeName]) continue;
      translateEl(el[i]);
    }
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n, batch = [];
    while ((n = walker.nextNode())) batch.push(n);
    for (var j = 0; j < batch.length; j++) translateText(batch[j]);
  }

  function run(fn) {
    applying = true;
    try { fn(); } finally {
      if (observer) observer.takeRecords();
      applying = false;
    }
  }

  /* ---------- Arabic typefaces ----------
     Cormorant and Jost have no Arabic glyphs. Amiri keeps the serif
     voice of the headlines and Almarai matches Jost's geometry in the
     interface — loaded only when Arabic is actually chosen. */
  function loadArabicFonts() {
    if (document.getElementById('mozArabicFonts')) return;
    var l = document.createElement('link');
    l.id = 'mozArabicFonts';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Almarai:wght@300;400;700&display=swap';
    document.head.appendChild(l);
  }

  function applyLang(next, opts) {
    lang = next;
    var meta = LANGS.filter(function (l) { return l.code === next; })[0] || LANGS[0];
    var html = document.documentElement;
    html.setAttribute('lang', meta.htmlLang);
    html.setAttribute('dir', meta.dir);
    html.classList.toggle('is-rtl', meta.dir === 'rtl');
    html.classList.remove('lang-en', 'lang-ru', 'lang-ar');
    html.classList.add('lang-' + next);
    if (next === 'ar') loadArabicFonts();

    run(function () { walk(document.documentElement); });

    if (!opts || !opts.silent) {
      try { localStorage.setItem(STORAGE, next); } catch (e) { /* private mode */ }
      document.dispatchEvent(new CustomEvent('moz:langchange', { detail: { lang: next } }));
      // the pinned scroll scenes measure themselves against the old text
      if (window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 60);
    }
    syncSwitchers();
  }

  /* ============================================================
     4b. Currency
     The dirham is pegged to the dollar by the UAE central bank, so the
     conversion is a fact rather than a quote of the day and needs no
     live rate. The consignment list is written in dollars, so the dollar
     stays the reference figure and the product page says so outright —
     a converted, rounded number must not pass itself off as the house's
     own price.
     ============================================================ */
  var CURRENCIES = ['AED', 'USD'];
  var AED_PER_USD = 3.6725;
  var AED_ROUND = 100;
  var CUR_STORAGE = 'moz.currency';
  var currency = 'AED';

  function formatMoney(usd) {
    var n = Number(usd);
    if (!n) return '';
    if (currency === 'USD') return '$' + n.toLocaleString('en-US');
    var aed = Math.round(n * AED_PER_USD / AED_ROUND) * AED_ROUND;
    var num = aed.toLocaleString('en-US');
    return lang === 'ar' ? num + ' درهم' : 'AED ' + num;
  }

  function applyCurrency(next) {
    currency = next;
    try { localStorage.setItem(CUR_STORAGE, next); } catch (e) { /* private mode */ }
    document.documentElement.setAttribute('data-currency', next);
    document.dispatchEvent(new CustomEvent('moz:currencychange', { detail: { currency: next } }));
    syncSwitchers();
  }

  function initialCurrency() {
    var stored = null;
    try { stored = localStorage.getItem(CUR_STORAGE); } catch (e) { /* private mode */ }
    return CURRENCIES.indexOf(stored) > -1 ? stored : 'AED';
  }

  /* ============================================================
     5. The switchers
     ============================================================ */
  function buildSwitcher() {
    var wrap = document.createElement('div');
    wrap.className = 'lang';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Language');
    wrap.setAttribute('data-i18n-skip', '');
    var html = '<span class="lang__pill" aria-hidden="true"></span>';
    LANGS.forEach(function (l) {
      html += '<button type="button" class="lang__opt" data-lang="' + l.code + '" lang="' + l.htmlLang +
              '" title="' + l.name + '" aria-label="' + l.name + '">' + l.label + '</button>';
    });
    wrap.innerHTML = html;

    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang__opt');
      if (!btn) return;
      var code = btn.getAttribute('data-lang');
      if (code === lang) return;
      wrap.classList.add('is-changing');
      setTimeout(function () { wrap.classList.remove('is-changing'); }, 700);
      applyLang(code);
    });
    return wrap;
  }

  function buildCurrencySwitcher() {
    var wrap = document.createElement('div');
    wrap.className = 'lang lang--currency';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Currency');
    wrap.setAttribute('data-i18n-skip', '');
    wrap.innerHTML = '<span class="lang__pill" aria-hidden="true"></span>' +
      CURRENCIES.map(function (c) {
        return '<button type="button" class="lang__opt" data-currency="' + c + '">' + c + '</button>';
      }).join('');

    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang__opt');
      if (!btn) return;
      var code = btn.getAttribute('data-currency');
      if (code === currency) return;
      wrap.classList.add('is-changing');
      setTimeout(function () { wrap.classList.remove('is-changing'); }, 700);
      applyCurrency(code);
    });
    return wrap;
  }

  function movePill(wrap, sel) {
    var active = wrap.querySelector(sel);
    var pill = wrap.querySelector('.lang__pill');
    if (!active || !pill) return;
    pill.style.width = active.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + active.offsetLeft + 'px)';
  }

  function syncSwitchers() {
    Array.prototype.forEach.call(document.querySelectorAll('.lang'), function (wrap) {
      var isCur = wrap.classList.contains('lang--currency');
      var attr = isCur ? 'data-currency' : 'data-lang';
      var now = isCur ? currency : lang;
      Array.prototype.forEach.call(wrap.querySelectorAll('.lang__opt'), function (b) {
        var on = b.getAttribute(attr) === now;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      movePill(wrap, '.lang__opt[' + attr + '="' + now + '"]');
    });
  }

  // The currency control only appears where there are prices to convert.
  function pageHasPrices() {
    return !!(document.getElementById('catGrid') || document.getElementById('pdp'));
  }

  function mountSwitchers() {
    var slots = document.querySelectorAll('.header__right');
    Array.prototype.forEach.call(slots, function (slot) {
      var toggle = slot.querySelector('.menu-toggle');
      if (!slot.querySelector('.lang:not(.lang--currency)')) {
        var sw = buildSwitcher();
        run(function () { slot.insertBefore(sw, toggle || null); });
      }
      if (pageHasPrices() && !slot.querySelector('.lang--currency')) {
        var cw = buildCurrencySwitcher();
        run(function () { slot.insertBefore(cw, toggle || null); });
        document.body.classList.add('has-currency');
      }
      // fonts settle a frame later; measure the pills after that
      requestAnimationFrame(function () { syncSwitchers(); });
      setTimeout(syncSwitchers, 400);
    });
  }

  /* ============================================================
     6. Boot
     ============================================================ */
  function initialLang() {
    var q = null;
    try { q = new URLSearchParams(location.search).get('lang'); } catch (e) { /* older browser */ }
    var stored = null;
    try { stored = localStorage.getItem(STORAGE); } catch (e) { /* private mode */ }
    var wanted = q || stored || DEFAULT;
    if (!LANGS.some(function (l) { return l.code === wanted; })) return DEFAULT;
    // A link shared as ?lang=ar has to survive the first click into the site,
    // otherwise the visitor is dropped back into English on page two.
    if (q === wanted && q !== stored) {
      try { localStorage.setItem(STORAGE, wanted); } catch (e) { /* private mode */ }
    }
    return wanted;
  }

  observer = new MutationObserver(function (records) {
    if (applying) return;
    run(function () {
      records.forEach(function (r) {
        if (r.type === 'characterData') { translateText(r.target); return; }
        Array.prototype.forEach.call(r.addedNodes, function (n) {
          if (n.nodeType === 1 || n.nodeType === 3) walk(n);
        });
      });
      mountSwitchers();
    });
  });

  lang = initialLang();
  currency = initialCurrency();
  document.documentElement.setAttribute('data-currency', currency);
  var meta0 = LANGS.filter(function (l) { return l.code === lang; })[0];
  document.documentElement.setAttribute('lang', meta0.htmlLang);
  document.documentElement.setAttribute('dir', meta0.dir);
  document.documentElement.classList.add('lang-' + lang);
  if (meta0.dir === 'rtl') document.documentElement.classList.add('is-rtl');
  if (lang === 'ar') loadArabicFonts();

  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  document.addEventListener('DOMContentLoaded', function () {
    run(function () { walk(document.documentElement); });
    mountSwitchers();
    syncSwitchers();
  });
  window.addEventListener('load', function () { setTimeout(syncSwitchers, 100); });
  window.addEventListener('resize', function () { syncSwitchers(); });

  /* ---------- API for the scripts that build their own strings ---------- */
  window.I18N = {
    get lang() { return lang; },
    set: function (code) { applyLang(code); },
    /* t('A further {n} pieces…', { n: 12 }) — falls back to the English
       template, so the catalogue still reads correctly without a dictionary. */
    t: function (tpl, params) {
      var out = (lang !== 'en' && T[lang] && T[lang][tpl]) || tpl;
      if (typeof out === 'function') out = out(params || {});
      return String(out).replace(/\{(\w+)\}/g, function (m, k) {
        return (params && params[k] !== undefined) ? params[k] : m;
      });
    },
    plural: function (n, forms) {
      if (lang === 'ru') return ruPlural(n, forms.one, forms.few, forms.many);
      return n === 1 ? forms.one : forms.many;
    }
  };

  window.MONEY = {
    get code() { return currency; },
    set: applyCurrency,
    rate: AED_PER_USD,
    /* format(5100) -> "AED 18,700" · "$5,100" · "18,700 درهم" */
    format: formatMoney,
    usd: function (n) { return '$' + Number(n).toLocaleString('en-US'); }
  };
})();
