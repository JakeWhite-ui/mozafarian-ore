/* ============================================================
   MOZAFARIAN — ORE-genre interactions
   Lenis smooth scroll + GSAP ScrollTrigger + drag carousel
   ============================================================ */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof gsap !== 'undefined';
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------------- SCRAMBLE TEXT ---------------- */
  function scramble(el, finalText, opts) {
    opts = opts || {};
    const charset = opts.charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const dur = opts.duration || 800;
    const chars = finalText.split('');
    const start = performance.now();
    function frame(now) {
      const p = Math.min(1, (now - start) / dur);
      const reveal = p * chars.length;
      let out = '';
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        if (i < reveal || /[^A-Za-z0-9]/.test(ch)) out += ch;
        else out += charset[Math.floor(Math.random() * charset.length)];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(frame); else el.textContent = finalText;
    }
    requestAnimationFrame(frame);
  }
  function rollCounter(el, finalText) {
    if (reduce) { el.textContent = finalText; return; }
    scramble(el, finalText, { duration: 340, charset: '0123456789' });
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* ---------------- PRELOADER ---------------- */
  function runPreloader(done) {
    const el = document.getElementById('preloader');
    const num = document.getElementById('preloadCount');
    if (!el || reduce || !hasGSAP) { if (el) el.style.display = 'none'; done(); return; }

    const counter = { v: 0 };
    gsap.to(counter, {
      v: 100, duration: 1.6, ease: 'power2.inOut',
      onUpdate: () => { num.textContent = Math.round(counter.v); },
      onComplete: () => {
        gsap.to(el, {
          yPercent: -100, duration: 0.9, ease: 'power4.inOut', delay: 0.15,
          onStart: () => el.classList.add('is-done'),
          onComplete: () => { el.style.display = 'none'; done(); }
        });
      }
    });
  }

  /* ---------------- LENIS SMOOTH SCROLL ---------------- */
  let lenis = null;
  function initLenis() {
    if (reduce || typeof Lenis === 'undefined') return;
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', () => { if (window.ScrollTrigger) ScrollTrigger.update(); });
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  function scrollTo(target) {
    if (lenis) lenis.scrollTo(target, { offset: 0 });
    else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }

  /* ---------------- ANCHOR LINKS ---------------- */
  document.querySelectorAll('[data-scroll-to]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) { e.preventDefault(); closeMenu(); scrollTo(href); }
    });
  });

  /* ---------------- FULLSCREEN MENU ---------------- */
  const menu = document.getElementById('menuOverlay');
  const menuToggle = document.getElementById('menuToggle');
  let menuOpen = false;
  function openMenu() {
    menuOpen = true; menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false'); menuToggle.setAttribute('aria-expanded', 'true');
    if (!reduce) scramble(menuToggle, 'CLOSE', { duration: 450 }); else menuToggle.textContent = 'CLOSE';
    if (hasGSAP && !reduce) gsap.fromTo('.menu-overlay__list a',
      { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'power3.out', delay: 0.15 });
  }
  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false; menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true'); menuToggle.setAttribute('aria-expanded', 'false');
    if (!reduce) scramble(menuToggle, 'MENU', { duration: 450 }); else menuToggle.textContent = 'MENU';
  }
  menuToggle?.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));

  /* ---------------- TEXT / FADE REVEALS ---------------- */
  function initReveals() {
    if (!hasGSAP) return;
    if (reduce) { document.querySelectorAll('.reveal-fade,.line>span').forEach(el => gsap.set(el, { opacity: 1, y: 0, yPercent: 0 })); return; }

    // hero title lines (play after preloader)
    gsap.set('.line > span', { yPercent: 110 });
    gsap.set('.reveal-fade', { opacity: 0, y: 24 });

    // masked lines that live inside scrolled sections
    document.querySelectorAll('.reveal-lines').forEach((block) => {
      gsap.to(block.querySelectorAll('.line > span'), {
        yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.09,
        scrollTrigger: { trigger: block, start: 'top 80%' }
      });
    });

    // generic fade-ups
    document.querySelectorAll('.reveal-fade').forEach((el) => {
      if (el.closest('#hero')) return; // hero handled in intro
      gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
  }

  function playHeroIntro() {
    if (!hasGSAP || reduce) return;
    const tl = gsap.timeline({ delay: 0.1 });
    tl.to('#hero .line > span', { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12 })
      .to('#hero .reveal-fade', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, '-=0.7');
  }

  /* ---------------- HERITAGE COUNTERS ---------------- */
  function initCounters() {
    if (!hasGSAP) return;
    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const isYear = target > 100;
      if (reduce) { el.textContent = target; return; }
      const obj = { v: isYear ? target - 40 : 0 };
      el.textContent = obj.v;
      gsap.to(obj, {
        v: target, duration: 1.6, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.v); },
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
  }

  /* ---------------- GIANT WORD PARALLAX ---------------- */
  function initParallax() {
    if (!hasGSAP || reduce) return;
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const amt = parseFloat(el.getAttribute('data-parallax'));
      gsap.to(el, {
        xPercent: amt, ease: 'none',
        scrollTrigger: { trigger: el.closest('.scene'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  /* ---------------- DRAG CAROUSEL (grayscale -> color) ---------------- */
  function initCarousel() {
    const wrap = document.getElementById('carousel');
    const track = document.getElementById('carouselTrack');
    const counter = document.getElementById('carouselCounter');
    if (!wrap || !track) return;
    const items = [...track.querySelectorAll('.c-item')];
    const total = items.length;

    let x = 0, target = 0, min = 0, max = 0;
    let dragging = false, startX = 0, startPos = 0, velocity = 0, lastX = 0, current = -1;

    function itemCenter(i) { return items[i].offsetLeft + items[i].offsetWidth / 2; }
    function snapPos(i) { return window.innerWidth / 2 - itemCenter(i); }
    function bounds() { max = snapPos(0); min = snapPos(total - 1); } // every card can reach the centre
    function nearestIndex(pos) {
      let best = 0, bd = Infinity;
      for (let i = 0; i < total; i++) { const d = Math.abs(snapPos(i) - pos); if (d < bd) { bd = d; best = i; } }
      return best;
    }
    bounds();
    target = snapPos(0); x = target; // start centred on the first card
    window.addEventListener('resize', () => { bounds(); target = snapPos(nearestIndex(target)); });

    function updateActive() {
      const centerX = window.innerWidth / 2;
      let best = 0, bestDist = Infinity;
      items.forEach((it, i) => {
        const r = it.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(c - centerX);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      items.forEach((it, i) => it.classList.toggle('is-active', i === best));
      if (best !== current) {
        current = best;
        if (counter) rollCounter(counter, String(best + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0'));
        // only the active card's video plays; others pause on their poster frame
        items.forEach((it, i) => {
          const v = it.querySelector('.c-item__video');
          if (!v) return;
          if (i === best && !reduce) { try { v.currentTime = 0; v.play().catch(() => {}); } catch (e) {} }
          else { v.pause(); }
        });
      }
    }

    function render() {
      x += (target - x) * 0.11;
      track.style.transform = 'translate3d(' + x + 'px,0,0)';
      updateActive();
      requestAnimationFrame(render);
    }
    if (!reduce) requestAnimationFrame(render); else updateActive();

    function down(clientX) {
      dragging = true; wrap.classList.add('is-dragging');
      startX = clientX; startPos = target; lastX = clientX; velocity = 0; showCursor(true);
    }
    function move(clientX) {
      if (!dragging) return;
      const dx = clientX - startX;
      let t = startPos + dx;
      if (t > max) t = max + (t - max) * 0.35;
      if (t < min) t = min + (t - min) * 0.35;
      target = t; velocity = clientX - lastX; lastX = clientX;
    }
    function up() {
      if (!dragging) return;
      dragging = false; wrap.classList.remove('is-dragging'); showCursor(false);
      const projected = clamp(target + velocity * 6, min, max); // flick projection, then snap to center
      target = snapPos(nearestIndex(projected));
    }

    wrap.addEventListener('mousedown', (e) => { e.preventDefault(); down(e.clientX); });
    window.addEventListener('mousemove', (e) => move(e.clientX));
    window.addEventListener('mouseup', up);
    wrap.addEventListener('touchstart', (e) => down(e.touches[0].clientX), { passive: true });
    wrap.addEventListener('touchmove', (e) => move(e.touches[0].clientX), { passive: true });
    wrap.addEventListener('touchend', up);
    // click a side card to bring it to centre
    items.forEach((it, i) => it.addEventListener('click', () => { if (Math.abs(velocity) < 3) target = snapPos(i); }));

    /* cursor label */
    const cursor = document.getElementById('cursorLabel');
    let overCarousel = false;
    function showCursor(force) { if (cursor) cursor.classList.toggle('is-visible', force || overCarousel); }
    wrap.addEventListener('mouseenter', () => { overCarousel = true; showCursor(); });
    wrap.addEventListener('mouseleave', () => { overCarousel = false; if (!dragging) showCursor(false); });
    window.addEventListener('mousemove', (e) => {
      if (cursor && (overCarousel || dragging)) { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }
    });
  }

  /* ---------------- REAL MEDIA -> hide placeholders ---------------- */
  function initMedia() {
    // if hero video actually loads a frame, drop its placeholder
    const v = document.querySelector('.hero__video');
    if (v) v.addEventListener('loadeddata', () => {
      const ph = v.parentElement.querySelector('.media-placeholder');
      if (ph && v.videoWidth) ph.style.opacity = '0';
    });
  }

  /* ---------------- BOOT ---------------- */
  window.addEventListener('DOMContentLoaded', () => {
    initReveals();
    initCounters();
    initParallax();
    initCarousel();
    initMedia();
    runPreloader(() => {
      initLenis();
      playHeroIntro();
      const hc = document.getElementById('headerCode');
      if (hc && !reduce) scramble(hc, '1.821', { duration: 1100, charset: '0123456789.' });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });
})();
