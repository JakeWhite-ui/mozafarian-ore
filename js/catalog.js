/* ============================================================
   Mozafarian — Catalogue logic (shop grid + product detail)
   Vanilla JS, no framework. Reads ./data/products.json
   ============================================================ */
(function () {
  'use strict';

  var MAILTO = 'info@mozafarian.ae';
  var PAGE_SIZE = 24;

  /* ---------- shared: fullscreen menu toggle ---------- */
  function initMenu() {
    if (window.__shellMounted) return; // shell.js owns the menu on interior pages
    var toggle = document.getElementById('menuToggle');
    var overlay = document.getElementById('menuOverlay');
    if (!toggle || !overlay) return;
    toggle.addEventListener('click', function () {
      var open = overlay.classList.toggle('is-open');
      overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'CLOSE' : 'MENU';
    });
  }

  /* ---------- reveal on scroll ---------- */
  var io = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px' })
    : null;

  function reveal(el) { if (io) io.observe(el); else el.classList.add('is-in'); }

  /* ---------- data ---------- */
  // Versioned like css/js: without it the browser keeps serving a stale
  // catalogue, so price and photo updates never reach the visitor.
  var DATA_V = 10;

  function loadProducts() {
    return fetch('./data/products.json?v=' + DATA_V).then(function (r) {
      if (!r.ok) throw new Error('products.json ' + r.status);
      return r.json();
    });
  }

  // Pieces carrying a retail price show it; the rest of the house stays
  // "on request" until the client prices them.
  function money(n) { return '$' + Number(n).toLocaleString('en-US'); }
  function priceLabel(p) {
    return (p && p.price) ? money(p.price) : 'Price on request';
  }

  /* ---------- PDP spec table ----------
     Built from whatever the piece actually carries, so a fully documented
     consignment piece shows stones and certificate while an unpriced
     catalogue entry still reads as a proper record. */
  function specRows(p) {
    var rows = [['Maison', 'Mozafarian · Since 1821', '']];
    if (p.sku) rows.push(['Reference', p.sku, '']);
    rows.push(['Category', p.category, '']);
    if (p.metal) {
      rows.push(['Metal', p.metal + (p.goldWeight ? ' · ' + p.goldWeight + ' g' : ''), '']);
    }
    if (p.stones && p.stones.length) {
      p.stones.forEach(function (s, i) {
        var bits = [];
        if (s.pcs) bits.push(s.pcs + (Number(s.pcs) === 1 ? ' stone' : ' stones'));
        if (s.cts) bits.push(s.cts + ' ct');
        if (s.clarity) bits.push(s.clarity);
        rows.push([i === 0 ? 'Diamonds' : '', (s.colour ? s.colour + ' — ' : '') + bits.join(' · '), '']);
      });
      if (p.totalCts) {
        rows.push(['Total weight', p.totalCts + ' ct' + (p.totalPcs ? ' · ' + p.totalPcs + ' stones' : ''), '']);
      }
    }
    if (p.lab && p.cert) rows.push(['Certificate', p.lab + ' ' + p.cert, 'v--gold']);
    rows.push(['Availability', p.price ? 'In the boutique' : 'On request', 'v--gold']);
    return rows.map(function (r) {
      return '<div><span class="k">' + escapeHtml(r[0]) + '</span>' +
             '<span class="v ' + r[2] + '">' + escapeHtml(String(r[1])) + '</span></div>';
    }).join('');
  }

  function enquireHref(p) {
    return waLink('I would like to enquire about "' + p.title + '" (' + p.category + '). ' +
      location.origin + location.pathname.replace(/[^/]*$/, '') + 'product.html?handle=' + p.handle);
  }

  /* ---------- card ---------- */
  function cardEl(p) {
    var a = document.createElement('a');
    a.className = 'card';
    a.href = './product.html?handle=' + encodeURIComponent(p.handle);
    var hasImg = p.images && p.images.length;
    var media;
    if (hasImg) {
      var alt = p.images[1] ? '<img class="card__img card__img--alt" loading="lazy" alt="">' : '';
      media =
        '<span class="card__cat">' + p.category + '</span>' +
        '<img class="card__img" loading="lazy" alt="' + escapeAttr(p.title) + '">' + alt;
    } else {
      media =
        '<span class="card__cat">' + p.category + '</span>' +
        '<span class="card__ph"><span class="crown crown--ph"></span><span class="card__ph-note">Photography to follow</span></span>';
    }
    a.innerHTML =
      '<div class="card__media' + (hasImg ? '' : ' card__media--empty') + '">' + media + '</div>' +
      '<div class="card__body">' +
        '<h3 class="card__title">' + escapeHtml(p.title) + '</h3>' +
        '<span class="card__price' + (p.price ? ' card__price--set' : '') + '">' + priceLabel(p) + '</span>' +
      '</div>';
    if (hasImg) {
      var imgs = a.querySelectorAll('.card__img');
      setImg(imgs[0], p.images[0]);
      if (imgs[1]) setImg(imgs[1], p.images[1]);
    }
    reveal(a);
    return a;
  }

  function setImg(img, src) {
    if (!img || !src) return;
    img.addEventListener('load', function () { img.classList.add('is-loaded'); });
    img.addEventListener('error', function () { img.style.display = 'none'; });
    img.src = src;
  }

  /* ---------- SHOP page ---------- */
  function initShop() {
    var grid = document.getElementById('catGrid');
    if (!grid) return;
    var filterBar = document.getElementById('catFilters');
    var countEl = document.getElementById('catCount');
    var moreWrap = document.getElementById('catMore');

    // gender scope: ?gender= or <body data-gender="her|him"> (for-her / for-him pages)
    var gender = paramOf('gender') || document.body.getAttribute('data-gender') || '';
    function inGender(p) {
      if (!gender) return true;
      if (gender === 'him') return p.g === 'him' || p.g === 'uni';
      // For Her excludes the old (yellow-gold) collection
      if (gender === 'her') return (p.g === 'her' || p.g === 'uni') && !p.old;
      return true;
    }

    var state = { scope: [], filtered: [], shown: 0, cat: paramOf('category') || 'All', curated: true };

    function hasImg(p) { return p.images && p.images.length; }

    // Curation is decided per category, not once for the whole catalogue.
    // Deciding it globally meant one photographed category (Watches) put every
    // other category on a curated list it had no pieces in — /shop?category=Rings
    // rendered an empty grid while the hub advertised 184 rings.
    function inCat(cat) {
      return cat === 'All' ? state.scope.slice()
        : state.scope.filter(function (p) { return p.category === cat; });
    }

    // What a category actually shows: its photographed pieces if it has any,
    // otherwise the full list as awaiting-photography cards. Never empty.
    function viewOf(cat) {
      var all = inCat(cat);
      var shot = all.filter(hasImg);
      var curated = state.showAll ? false : shot.length > 0;
      return { list: curated ? shot : all, total: all.length, curated: curated };
    }

    loadProducts().then(function (data) {
      var scope = data.filter(inGender);
      state.scope = scope;
      state.showAll = paramOf('all') === '1';

      // A lookbook page with nothing photographed in this scope: show the
      // lookbook alone rather than a wall of empty cards.
      if (!scope.some(hasImg) && document.querySelector('.lookbook') && !state.showAll) {
        filterBar.style.display = 'none';
        grid.style.display = 'none';
        moreWrap.innerHTML = '<div class="cat-archive">' + t('archive.whole',
          'The full collection runs to <strong>{pieces}</strong>, catalogued and held in the boutique while photography is completed. ' +
          '<a href="{all}">Browse the full collection</a> or ' +
          '<a target="_blank" rel="noopener" href="{wa}">ask us about a piece</a>.',
          {
            pieces: pieces(scope.length),
            all: showAllHref(),
            wa: waLink('I would like to ask about a piece from the collection.')
          }) + '</div>';
        return;
      }

      buildFilters(scope);
      applyFilter(state.cat);
    }).catch(function (err) {
      grid.innerHTML = '<div class="cat-empty"><span>Catalogue unavailable.</span> ' + escapeHtml(String(err.message)) + '</div>';
    });

    // Built from the whole scope so every category the menu and the hub link to
    // is reachable here, photographed or not.
    function buildFilters(data) {
      var counts = {};
      data.forEach(function (p) { counts[p.category] = (counts[p.category] || 0) + 1; });
      // order: hero categories first, then rest by count
      var order = ['Rings', 'Jewellery', 'Watches', 'Bangles', 'Necklaces', 'Bracelets', 'Charms', 'Sets'];
      var cats = Object.keys(counts).sort(function (a, b) {
        var ia = order.indexOf(a), ib = order.indexOf(b);
        if (ia === -1) ia = 99; if (ib === -1) ib = 99;
        return ia - ib || counts[b] - counts[a];
      });
      var frag = document.createDocumentFragment();
      frag.appendChild(mkFilter('All', data.length));
      cats.forEach(function (c) { frag.appendChild(mkFilter(c, counts[c])); });
      filterBar.insertBefore(frag, countEl);
    }

    function mkFilter(label, n) {
      var b = document.createElement('button');
      b.className = 'cat-filter' + (label === state.cat ? ' is-active' : '');
      b.textContent = label;
      b.setAttribute('data-cat', label);
      b.addEventListener('click', function () { applyFilter(label); pushUrl(label); });
      return b;
    }

    function applyFilter(cat) {
      state.cat = cat;
      var view = viewOf(cat);
      state.filtered = view.list;
      state.curated = view.curated;
      state.catTotal = view.total;
      // photographed pieces lead the grid; awaiting-photography follow
      state.filtered.sort(function (a, b) {
        return (b.images && b.images.length ? 1 : 0) - (a.images && a.images.length ? 1 : 0);
      });
      state.shown = 0;
      grid.innerHTML = '';
      Array.prototype.forEach.call(filterBar.querySelectorAll('.cat-filter'), function (f) {
        f.classList.toggle('is-active', f.getAttribute('data-cat') === cat);
      });
      renderMore();
    }

    function renderMore() {
      var next = state.filtered.slice(state.shown, state.shown + PAGE_SIZE);
      var frag = document.createDocumentFragment();
      next.forEach(function (p) { frag.appendChild(cardEl(p)); });
      grid.appendChild(frag);
      state.shown += next.length;
      countEl.textContent = pieces(state.filtered.length);
      moreWrap.innerHTML = '';
      if (state.shown < state.filtered.length) {
        var btn = document.createElement('button');
        btn.className = 'btn btn--ghost';
        btn.textContent = 'Load more (' + (state.filtered.length - state.shown) + ')';
        btn.addEventListener('click', renderMore);
        moreWrap.appendChild(btn);
      }
      renderArchiveNote();
    }

    // Keeps the category the visitor is standing in when they ask to see
    // everything, rather than dropping them back into the whole catalogue.
    function showAllHref() {
      var q = new URLSearchParams(location.search);
      q.set('all', '1');
      if (state.cat === 'All') q.delete('category'); else q.set('category', state.cat);
      return '?' + q.toString();
    }

    // The rest of the collection is in the boutique but not yet photographed —
    // say so plainly instead of padding the grid with empty cards.
    function renderArchiveNote() {
      if (!state.curated || state.shown < state.filtered.length) return;
      var rest = state.catTotal - state.filtered.length;
      if (rest <= 0) return;
      var note = document.createElement('div');
      note.className = 'cat-archive';
      note.innerHTML = t('archive.rest',
        'A further <strong>{pieces}</strong> are held in the boutique and are being photographed. ' +
        '<a href="{all}">View the full catalogue</a> or ' +
        '<a target="_blank" rel="noopener" href="{wa}">enquire about a specific piece</a>.',
        {
          pieces: pieces(rest),
          all: showAllHref(),
          wa: waLink('I would like to enquire about a piece that is not yet shown on the site.')
        });
      moreWrap.appendChild(note);
    }

    function pushUrl(cat) {
      var u = new URL(location.href);
      if (cat === 'All') u.searchParams.delete('category'); else u.searchParams.set('category', cat);
      history.replaceState(null, '', u);
    }
  }

  /* ---------- PRODUCT page ---------- */
  function initProduct() {
    var root = document.getElementById('pdp');
    if (!root) return;
    var handle = paramOf('handle');

    loadProducts().then(function (data) {
      var p = data.find(function (x) { return x.handle === handle; });
      if (!p) { root.innerHTML = '<div class="cat-empty"><span>Piece not found.</span> <a href="./shop.html" style="color:var(--powder)">Back to catalogue</a></div>'; return; }
      document.title = p.title + ' — Mozafarian';
      renderPDP(root, p);
      renderRelated(data, p);
    }).catch(function (err) {
      root.innerHTML = '<div class="cat-empty"><span>Unavailable.</span> ' + escapeHtml(String(err.message)) + '</div>';
    });

    function renderPDP(root, p) {
      var hasImg = p.images && p.images.length;
      var thumbs = hasImg ? p.images.map(function (src, i) {
        return '<button class="pdp__thumb' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '"><img src="' + src + '" alt="" loading="lazy"></button>';
      }).join('') : '';
      var stage = hasImg
        ? '<div class="pdp__stage"><img id="pdpMain" src="' + p.images[0] + '" alt="' + escapeAttr(p.title) + '"></div>'
        : '<div class="pdp__stage pdp__stage--empty"><span class="pdp__ph"><span class="crown crown--ph-lg"></span><span class="n">Photography to follow</span></span></div>';
      root.innerHTML =
        '<div class="pdp__gallery">' +
          stage +
          (hasImg && p.images.length > 1 ? '<div class="pdp__thumbs">' + thumbs + '</div>' : '') +
        '</div>' +
        '<div class="pdp__info">' +
          '<span class="eyebrow pdp__cat">' + p.category + '</span>' +
          '<h1 class="pdp__title">' + escapeHtml(p.title) + '</h1>' +
          '<div class="pdp__price">' + priceLabel(p) +
            (p.price ? '<span class="pdp__cur">' + (p.currency || 'USD') + '</span>' : '') +
          '</div>' +
          '<div class="pdp__specs">' + specRows(p) + '</div>' +
          '<div class="pdp__actions">' +
            '<a class="btn btn--filled" target="_blank" rel="noopener" href="' + enquireHref(p) + '">Enquire on WhatsApp</a>' +
            '<a class="btn btn--ghost" href="mailto:' + MAILTO + '?subject=' + encodeURIComponent('Private viewing — ' + p.title) + '">Write to us</a>' +
          '</div>' +
          '<p class="pdp__note">' + (p.price
            ? 'Retail price shown in ' + (p.currency || 'USD') + ', excluding duties. This piece is held in the boutique and can be seen the same day — we will confirm availability and arrange a private viewing in Dubai or London.'
            : 'This piece is offered on request. Our team will share pricing, certification and availability, and can arrange a private viewing at our Dubai or London boutique.') +
          '</p>' +
        '</div>';

      var main = root.querySelector('#pdpMain');
      Array.prototype.forEach.call(root.querySelectorAll('.pdp__thumb'), function (t) {
        t.addEventListener('click', function () {
          var i = +t.getAttribute('data-i');
          main.src = p.images[i];
          root.querySelectorAll('.pdp__thumb').forEach(function (x) { x.classList.remove('is-active'); });
          t.classList.add('is-active');
        });
      });
    }

    function renderRelated(data, p) {
      var wrap = document.getElementById('relatedGrid');
      if (!wrap) return;
      var pool = data.filter(function (x) { return x.category === p.category && x.handle !== p.handle; });
      shuffle(pool);
      // prefer photographed pieces in the related row
      pool.sort(function (a, b) {
        return (b.images && b.images.length ? 1 : 0) - (a.images && a.images.length ? 1 : 0);
      });
      pool.slice(0, 4).forEach(function (x) { wrap.appendChild(cardEl(x)); });
      if (!pool.length) { var sec = document.getElementById('relatedSection'); if (sec) sec.style.display = 'none'; }
    }
  }

  /* ---------- JEWELLERY HUB (category tiles) ---------- */
  function initHub() {
    var grid = document.getElementById('hubGrid');
    if (!grid) return;
    // tile definitions map display label -> data category
    var A = './assets/products/';
    var TILES = [
      { label: 'Rings',                cat: 'Rings',     cover: A + 'moz-083.jpg' },
      { label: 'Fine Jewellery',       cat: 'Jewellery', cover: A + 'moz-097.jpg' },
      { label: 'Timepieces',           cat: 'Watches',   cover: A + 'moz-072.jpg' },
      { label: 'Bracelets & Bangles',  cat: 'Bangles',   cover: A + 'moz-109.jpg' },
      { label: 'Necklaces & Pendants', cat: 'Necklaces', cover: A + 'moz-102.jpg' }
    ];
    loadProducts().then(function (data) {
      var counts = {}, cover = {};
      data.forEach(function (p) {
        counts[p.category] = (counts[p.category] || 0) + 1;
        // prefer a real (non AI-placeholder) photo as the cover
        if (!cover[p.category] || (/Gemini_Generated/i.test(cover[p.category]) && !/Gemini_Generated/i.test(p.images[0]))) {
          cover[p.category] = p.images[0];
        }
      });
      grid.innerHTML = '';
      TILES.forEach(function (t) {
        if (!counts[t.cat]) return;
        grid.appendChild(hubTile(t, counts[t.cat], t.cover || cover[t.cat]));
      });
      // "view all" tile
      grid.appendChild(hubTile({ label: 'View all pieces', cat: null }, data.length, A + 'moz-110.jpg'));
    }).catch(function (err) {
      grid.innerHTML = '<div class="cat-empty"><span>Unavailable.</span> ' + escapeHtml(String(err.message)) + '</div>';
    });

    function hubTile(t, n, img) {
      var a = document.createElement('a');
      a.className = 'hub-tile' + (img ? '' : ' hub-tile--empty');
      a.href = t.cat ? ('./shop.html?category=' + encodeURIComponent(t.cat)) : './shop.html';
      var media = img
        ? '<img class="hub-tile__img" loading="lazy" alt="' + escapeAttr(t.label) + '">'
        : '<span class="hub-tile__ph"><span class="crown crown--ph-lg"></span></span>';
      a.innerHTML =
        media +
        '<div class="hub-tile__body">' +
          '<span class="hub-tile__label">' + t.label + '</span>' +
          '<span class="hub-tile__count">' + pieces(n) + '</span>' +
          '<span class="hub-tile__cta">Discover &rarr;</span>' +
        '</div>';
      if (img) setImg(a.querySelector('.hub-tile__img'), img);
      reveal(a);
      return a;
    }
  }

  /* ---------- lookbook ---------- */
  // The lookbook was a wall of photographs with nothing to click: someone who
  // fell for a piece had no way to ask about it. Each frame becomes its own
  // enquiry, quoting the shot reference so the boutique knows which piece is
  // meant — these are editorial shots, not catalogue entries, so the reference
  // is the only reliable handle on them.
  function initLookbook() {
    var items = document.querySelectorAll('.lookbook__item');
    if (!items.length) return;
    var scope = document.body.getAttribute('data-gender') === 'him' ? 'For Him' : 'For Her';

    Array.prototype.forEach.call(items, function (fig) {
      var img = fig.querySelector('img');
      if (!img || fig.querySelector('a')) return;

      var ref = (img.getAttribute('src') || '').split('/').pop().replace(/\.[a-z]+$/i, '');
      var piece = img.getAttribute('alt') || 'a piece';

      var a = document.createElement('a');
      a.className = 'lookbook__link';
      a.href = waLink('I would like to know more about the ' + piece.toLowerCase() +
        ' shown in the ' + scope + ' lookbook (reference ' + ref + ').');
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('aria-label', 'Enquire about ' + piece);

      fig.insertBefore(a, img);
      a.appendChild(img);

      var cap = document.createElement('span');
      cap.className = 'lookbook__cta';
      cap.textContent = 'Enquire';
      a.appendChild(cap);
    });
  }

  /* ---------- utils ---------- */
  // Sentences the page assembles itself (a count, two links) cannot be
  // translated node by node without scrambling the word order, so they go
  // through the dictionary whole. Without i18n.js the English template stands.
  function t(key, en, params) {
    if (window.I18N) {
      var out = window.I18N.t(key, params);
      if (out !== key) return out;
    }
    return String(en).replace(/\{(\w+)\}/g, function (m, k) {
      return (params && params[k] !== undefined) ? params[k] : m;
    });
  }
  function pieces(n) {
    return window.I18N ? window.I18N.t('{n} pieces', { n: n })
                       : n + ' piece' + (n === 1 ? '' : 's');
  }

  var WHATSAPP = '971561394378';
  // Enquiries go to WhatsApp with the message already written: in this market
  // it is how a client reaches a jeweller, and a mailto asks them to leave the
  // phone to open a mail client they may not have set up.
  function waLink(message) {
    return 'https://wa.me/' + WHATSAPP + '?text=' +
      encodeURIComponent('Hello Mozafarian. ' + message);
  }
  function paramOf(k) { return new URLSearchParams(location.search).get(k); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function escapeAttr(s) { return escapeHtml(s); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initLookbook();
    initShop();
    initProduct();
    initHub();
  });
})();
