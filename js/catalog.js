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
  function loadProducts() {
    return fetch('./data/products.json').then(function (r) {
      if (!r.ok) throw new Error('products.json ' + r.status);
      return r.json();
    });
  }

  function priceLabel() { return 'Price on request'; }

  function enquireHref(p) {
    var subject = 'Enquiry — ' + p.title;
    var body = 'Hello Mozafarian,%0D%0A%0D%0AI would like to enquire about "' + p.title +
      '" (' + p.category + ').%0D%0A%0D%0AReference: ' + location.origin + '/product.html?handle=' + p.handle +
      '%0D%0A%0D%0AThank you.';
    return 'mailto:' + MAILTO + '?subject=' + encodeURIComponent(subject) + '&body=' + body;
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
        '<span class="card__price">' + priceLabel() + '</span>' +
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

    var state = { all: [], filtered: [], shown: 0, cat: paramOf('category') || 'All' };

    loadProducts().then(function (data) {
      state.all = data.filter(inGender);
      buildFilters(state.all);
      applyFilter(state.cat);
    }).catch(function (err) {
      grid.innerHTML = '<div class="cat-empty">Catalogue unavailable. ' + escapeHtml(String(err.message)) + '</div>';
    });

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
      state.filtered = (cat === 'All') ? state.all.slice() : state.all.filter(function (p) { return p.category === cat; });
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
      countEl.textContent = state.filtered.length + ' pieces';
      moreWrap.innerHTML = '';
      if (state.shown < state.filtered.length) {
        var btn = document.createElement('button');
        btn.className = 'btn btn--ghost';
        btn.textContent = 'Load more (' + (state.filtered.length - state.shown) + ')';
        btn.addEventListener('click', renderMore);
        moreWrap.appendChild(btn);
      }
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
      if (!p) { root.innerHTML = '<div class="cat-empty">Piece not found. <a href="./shop.html" style="color:var(--powder)">Back to catalogue</a></div>'; return; }
      document.title = p.title + ' — Mozafarian';
      renderPDP(root, p);
      renderRelated(data, p);
    }).catch(function (err) {
      root.innerHTML = '<div class="cat-empty">Unavailable. ' + escapeHtml(String(err.message)) + '</div>';
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
          '<div class="pdp__price">' + priceLabel() + '</div>' +
          '<div class="pdp__specs">' +
            '<div><span class="k">Maison</span><span class="v">Mozafarian · Since 1821</span></div>' +
            '<div><span class="k">Category</span><span class="v">' + p.category + '</span></div>' +
            '<div><span class="k">Availability</span><span class="v v--gold">On request</span></div>' +
          '</div>' +
          '<div class="pdp__actions">' +
            '<a class="btn btn--filled" href="' + enquireHref(p) + '">Enquire about this piece</a>' +
            '<a class="btn btn--ghost" href="mailto:' + MAILTO + '?subject=' + encodeURIComponent('Private viewing — ' + p.title) + '">Book a private viewing</a>' +
          '</div>' +
          '<p class="pdp__note">Each Mozafarian piece is offered on request. Our team will share pricing, certification and availability, and can arrange a private viewing at our Dubai or London boutique.</p>' +
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
      grid.innerHTML = '<div class="cat-empty">Unavailable. ' + escapeHtml(String(err.message)) + '</div>';
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
          '<span class="hub-tile__count">' + n + ' piece' + (n === 1 ? '' : 's') + '</span>' +
          '<span class="hub-tile__cta">Discover &rarr;</span>' +
        '</div>';
      if (img) setImg(a.querySelector('.hub-tile__img'), img);
      reveal(a);
      return a;
    }
  }

  /* ---------- utils ---------- */
  function paramOf(k) { return new URLSearchParams(location.search).get(k); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function escapeAttr(s) { return escapeHtml(s); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initShop();
    initProduct();
    initHub();
  });
})();
