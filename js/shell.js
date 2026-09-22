/* ============================================================
   Mozafarian — shared shell for INTERIOR pages
   Injects header + fullscreen menu + footer (Graff-style taxonomy)
   so navigation lives in ONE place. Landing (index.html) keeps
   its own inline menu.
   Interior page must set: <body class="catalog-page" data-page="jewellery">
   and include <script src="./js/shell.js"></script> before catalog.js
   ============================================================ */
(function () {
  'use strict';

  // primary nav (mirrors Graff: High Jewellery / Jewellery / Engagement & Bridal / Watches / The House)
  var PRIMARY = [
    { key: 'home',    label: 'Home',               href: './index.html' },
    { key: 'high',    label: 'High Jewellery',     href: './high-jewellery.html' },
    { key: 'jewellery', label: 'Jewellery',        href: './jewellery.html' },
    { key: 'bridal',  label: 'Engagement & Bridal', href: './bridal.html' },
    { key: 'watches', label: 'Watches',            href: './watches.html' },
    { key: 'house',   label: 'The House',          href: './house.html' },
    { key: 'boutiques', label: 'Boutiques',        href: './boutiques.html' }
  ];

  // collections split (For Her / For Him)
  var COLLECTIONS = [
    { label: 'For Her', href: './for-her.html' },
    { label: 'For Him', href: './for-him.html' }
  ];

  // secondary: shop by category (deep-links into the catalogue grid)
  var CATEGORIES = [
    { label: 'Rings',              href: './shop.html?category=Rings' },
    { label: 'Necklaces & Pendants', href: './shop.html?category=Necklaces' },
    { label: 'Earrings',           href: './shop.html?category=Jewellery' },
    { label: 'Bracelets & Bangles', href: './shop.html?category=Bangles' },
    { label: 'Timepieces',         href: './shop.html?category=Watches' },
    { label: 'View all',           href: './shop.html' }
  ];

  var page = document.body.getAttribute('data-page') || '';

  /* ---------- header ---------- */
  function buildHeader() {
    var h = document.createElement('header');
    h.className = 'header header--solid';
    h.id = 'header';
    h.innerHTML =
      '<a href="./index.html" class="header__logo header__logo--mark">' +
        '<span class="crown"></span>' +
        '<span>MOZAFARIAN</span>' +
      '</a>' +
      '<div class="header__right">' +
        '<span class="header__code">1.821</span>' +
        '<button class="menu-toggle" id="menuToggle" aria-expanded="false" aria-controls="menuOverlay">MENU</button>' +
      '</div>';
    return h;
  }

  /* ---------- fullscreen menu ---------- */
  function buildMenu() {
    var nav = document.createElement('nav');
    nav.className = 'menu-overlay menu-overlay--rich';
    nav.id = 'menuOverlay';
    nav.setAttribute('aria-hidden', 'true');

    var primary = PRIMARY.map(function (item) {
      var active = (item.key === page) ? ' class="is-current"' : '';
      return '<li><a href="' + item.href + '"' + active + '>' + item.label + '</a></li>';
    }).join('');

    var cats = CATEGORIES.map(function (c) {
      return '<li><a href="' + c.href + '">' + c.label + '</a></li>';
    }).join('');

    var colls = COLLECTIONS.map(function (c) {
      return '<li><a href="' + c.href + '">' + c.label + '</a></li>';
    }).join('');

    nav.innerHTML =
      '<div class="menu-overlay__cols">' +
        '<ul class="menu-overlay__list">' + primary + '</ul>' +
        '<div class="menu-overlay__sub">' +
          '<span class="eyebrow">Collections</span>' +
          '<ul class="menu-overlay__catlist">' + colls + '</ul>' +
          '<span class="eyebrow" style="display:block;margin-top:26px">Shop by category</span>' +
          '<ul class="menu-overlay__catlist">' + cats + '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="menu-overlay__meta">' +
        '<span>Wafi City, Dubai</span>' +
        '<span>Knightsbridge, London</span>' +
        '<a href="mailto:info@mozafarian.ae">info@mozafarian.ae</a>' +
      '</div>';
    return nav;
  }

  /* ---------- footer ---------- */
  function buildFooter() {
    var f = document.createElement('footer');
    f.className = 'site-footer';
    f.innerHTML =
      '<div class="site-footer__cols">' +
        '<div class="site-footer__col site-footer__brand">' +
          '<span class="crown crown--footer"></span>' +
          '<span class="site-footer__logo">MOZAFARIAN</span>' +
          '<p>Fine jewellers since 1821. Seven generations, two homes — Dubai &amp; London.</p>' +
        '</div>' +
        '<div class="site-footer__col">' +
          '<span class="eyebrow">Explore</span>' +
          '<ul>' +
            '<li><a href="./high-jewellery.html">High Jewellery</a></li>' +
            '<li><a href="./jewellery.html">Jewellery</a></li>' +
            '<li><a href="./for-her.html">For Her</a></li>' +
            '<li><a href="./for-him.html">For Him</a></li>' +
            '<li><a href="./bridal.html">Engagement &amp; Bridal</a></li>' +
            '<li><a href="./watches.html">Watches</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="site-footer__col">' +
          '<span class="eyebrow">Client Services</span>' +
          '<ul>' +
            '<li><a href="mailto:info@mozafarian.ae?subject=Private%20viewing">Book a private viewing</a></li>' +
            '<li><a href="mailto:info@mozafarian.ae">Contact us</a></li>' +
            '<li><a href="./house.html">The House</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="site-footer__col">' +
          '<span class="eyebrow">Boutiques</span>' +
          '<ul>' +
            '<li><a href="./boutiques.html">Sofitel Obelisk, Wafi City, Dubai</a></li>' +
            '<li><a href="./boutiques.html">1 Knightsbridge Green, London</a></li>' +
            '<li><a href="tel:+971561394378">+971 56 13 94 378</a></li>' +
            '<li><a target="_blank" rel="noopener" href="https://wa.me/971561394378?text=Hello%20Mozafarian.%20I%20would%20like%20to%20arrange%20a%20viewing.">WhatsApp</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="site-footer__base">' +
        '<span>&copy; 2026 Mozafarian Jewellers</span>' +
        '<span>Dubai &amp; London</span>' +
      '</div>';
    return f;
  }

  /* ---------- menu toggle ---------- */
  function wireMenu() {
    var toggle = document.getElementById('menuToggle');
    var overlay = document.getElementById('menuOverlay');
    if (!toggle || !overlay) return;
    overlay.inert = true; // out of the tab order until opened
    toggle.addEventListener('click', function () {
      var open = overlay.classList.toggle('is-open');
      overlay.inert = !open;
      document.body.classList.toggle('menu-open', open); // lock scroll behind the overlay
      overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'CLOSE' : 'MENU';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) toggle.click();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // header + menu at top of body
    document.body.insertBefore(buildMenu(), document.body.firstChild);
    document.body.insertBefore(buildHeader(), document.body.firstChild);
    // footer at end of main (or body)
    var main = document.getElementById('smooth-content') || document.body;
    main.appendChild(buildFooter());
    wireMenu();
    // expose flag so catalog.js skips its own menu init
    window.__shellMounted = true;
  });
})();
