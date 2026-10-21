/* ============================================================
   main.js — Submerge in Silence
   Loader · Lenis smooth scroll · GSAP reveals · split type
   Parallax · horizontal "four days" · nav · menu · consent
   ============================================================ */
(function () {
  'use strict';

  const hasGSAP = typeof gsap !== 'undefined';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.prototype.slice.call((c || document).querySelectorAll(s));

  if (hasGSAP && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* ---------- 1. SMOOTH SCROLL (Lenis, optional) ---------- */
  let lenis = null;
  if (typeof Lenis !== 'undefined' && !reduced) {
    try {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95, touchMultiplier: 1.6 });
      if (hasGSAP) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    } catch (e) { lenis = null; }
    window.__lenis = lenis;
  }

  function scrollToHash(hash) {
    const el = document.querySelector(hash);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -10, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      if (!hash || hash === '#' || hash.length < 2) return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      closeMenu();
      scrollToHash(hash);
    });
  });

  /* ---------- 2. SPLIT TYPE ---------- */
  function splitWords(el) {
    if (el.dataset.splitDone) return $$('.word', el);
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    el.textContent = '';
    const frag = document.createDocumentFragment();
    text.split(' ').forEach((w, i, arr) => {
      const mask = document.createElement('span');
      mask.className = 'w';
      const inner = document.createElement('span');
      inner.className = 'word';
      inner.textContent = w;
      mask.appendChild(inner);
      frag.appendChild(mask);
      if (i < arr.length - 1) frag.appendChild(document.createTextNode(' '));
    });
    el.appendChild(frag);
    el.dataset.splitDone = '1';
    return $$('.word', el);
  }

  /* ---------- 3. LOADER ---------- */
  const loader = $('#loader');
  let introRan = false;

  function runIntro() {
    if (introRan) return;
    introRan = true;
    document.body.style.overflow = '';
    if (!hasGSAP || reduced) {
      if (loader) loader.remove();
      $$('[data-reveal]').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
      $$('[data-split]').forEach((el) => { splitWords(el); el.classList.add('is-revealed'); });
      buildScrollAnimations();
      return;
    }

    const heroWords = [];
    $$('.hero__title [data-split]').forEach((el) => heroWords.push.apply(heroWords, splitWords(el)));
    gsap.set(heroWords, { yPercent: 115 });
    gsap.set('.hero__eyebrow, .hero__lede, .hero__actions, .hero__bar', { opacity: 0, y: 20 });

    const tl = gsap.timeline();

    if (loader) {
      const counter = { v: 0 };
      tl.to('.loader__word', { yPercent: 0, duration: 1, stagger: 0.07, ease: 'power3.out' }, 0)
        .to('.loader__line i', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0.15)
        .to(counter, {
          v: 100, duration: 1.5, ease: 'power2.inOut',
          onUpdate: () => { const n = $('.loader__count'); if (n) n.textContent = String(Math.round(counter.v)).padStart(2, '0'); }
        }, 0.15)
        .to('.loader__inner, .loader__meta', { opacity: 0, y: -12, duration: 0.5, ease: 'power2.in' }, 1.7)
        .to(loader, {
          clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut',
          onComplete: () => loader.remove()
        }, 1.85);
    }

    tl.to(heroWords, {
      yPercent: 0, duration: 1.5, stagger: 0.06, ease: 'expo.out',
      onComplete: () => $$('.hero__title [data-split]').forEach((el) => el.classList.add('is-revealed'))
    }, '-=0.75')
      .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '<0.1')
      .to('.hero__lede', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '<0.15')
      .to('.hero__actions', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '<0.1')
      .to('.hero__bar', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '<0.05')
      .to('.depth', { opacity: 1, duration: 0.8 }, '<')
      .add(buildScrollAnimations, '<');
  }

  /* ---------- 4. SCROLL ANIMATIONS ---------- */
  let built = false;
  function buildScrollAnimations() {
    if (built || !hasGSAP || typeof ScrollTrigger === 'undefined') return;
    built = true;

    // reduced motion: everything visible, nothing moves
    if (reduced) {
      $$('[data-split], [data-split-words]').forEach((el) => { splitWords(el); el.classList.add('is-revealed'); });
      $$('[data-reveal]').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }

    // 4.1 — headings (word mask reveal)
    $$('[data-split]').forEach((el) => {
      if (el.closest('.hero__title')) return;
      const words = splitWords(el);
      gsap.set(words, { yPercent: 110 });
      gsap.to(words, {
        yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.035,
        onComplete: () => el.classList.add('is-revealed'),
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    // 4.2 — quote, word by word
    $$('[data-split-words]').forEach((el) => {
      const words = splitWords(el);
      gsap.set(words, { opacity: 0.12, y: 8 });
      gsap.to(words, {
        opacity: 1, y: 0, ease: 'none', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.6 }
      });
    });

    // 4.3 — generic reveals (the hero is handled by the intro timeline)
    $$('[data-reveal]').forEach((el) => {
      if (el.closest('.hero')) return;
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      });
    });

    // 4.4 — image parallax + reveal
    $$('[data-parallax]').forEach((el) => {
      const img = $('img', el) || el;
      const amt = parseFloat(el.dataset.parallax) || 0.1;
      gsap.fromTo(img, { yPercent: -amt * 100 * 0.5 }, {
        yPercent: amt * 100 * 0.5, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
      if (el.classList.contains('media')) {
        gsap.fromTo(el, { clipPath: 'inset(12% 6% 12% 6%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        });
      }
    });

    // 4.5 — the four days: pinned horizontal run on desktop
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const section = $('#days');
      const track = $('#daysTrack');
      if (!section || !track) return;
      track.style.overflowX = 'visible';  // GSAP drives x; the section clips
      // measure from layout (offsets ignore the transform we apply)
      const getDistance = () => {
        const last = track.lastElementChild;
        if (!last) return 0;
        const padRight = parseFloat(getComputedStyle(track).paddingRight) || 0;
        const content = last.offsetLeft + last.offsetWidth + padRight;
        return Math.max(0, content - window.innerWidth);
      };
      const tween = gsap.to(track, {
        x: () => -getDistance(), ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + (getDistance() + window.innerHeight * 0.4),
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
      gsap.from('.day', {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 60%', once: true }
      });
      return () => { track.style.overflowX = ''; tween.scrollTrigger && tween.scrollTrigger.kill(); tween.kill(); gsap.set(track, { clearProps: 'x' }); };
    });

    // 4.6 — depth meter
    const fill = $('#depthFill');
    if (fill) {
      gsap.to(fill, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { start: 0, end: () => document.body.scrollHeight - window.innerHeight, scrub: 0.3 }
      });
    }

    // 4.7b — depth meter flips to light type over the dark sections
    const depth = $('.depth');
    if (depth) {
      $$('.hero, .sec--dark, .sec--land, .sec--quote, .sec--close').forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec, start: 'top 50%', end: 'bottom 50%',
          onToggle: (self) => depth.classList.toggle('is-light', self.isActive)
        });
      });
    }

    // 4.7 — close section slow drift
    gsap.to('.close__waves', {
      yPercent: -12, ease: 'none',
      scrollTrigger: { trigger: '.sec--close', start: 'top bottom', end: 'bottom bottom', scrub: true }
    });

    ScrollTrigger.refresh();
  }

  /* ---------- 5. NAV ---------- */
  const nav = $('#nav');
  const hero = $('#hero');
  const ctaBar = $('#ctaBar');
  const reserve = $('#reserve');
  let lastY = 0;

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    const threshold = hero ? hero.offsetHeight - 90 : 400;
    if (nav) {
      nav.classList.toggle('is-solid', y > threshold);
      const goingDown = y > lastY && y > threshold + 200;
      nav.classList.toggle('is-hidden', goingDown && !document.body.classList.contains('menu-open'));
    }
    // sticky reserve bar: between the hero and the reserve section
    if (ctaBar && hero && reserve) {
      const show = y > hero.offsetHeight * 0.92 &&
                   y < reserve.getBoundingClientRect().top + y - window.innerHeight * 0.55 &&
                   !document.body.classList.contains('menu-open');
      ctaBar.classList.toggle('is-visible', show);
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 6. MENU ---------- */
  const burger = $('#burger');
  const menu = $('#menu');
  $$('.menu__list a').forEach((a, i) => a.style.setProperty('--i', i));

  function openMenu() {
    document.body.classList.add('menu-open');
    if (menu) menu.setAttribute('aria-hidden', 'false');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    if (lenis) lenis.stop();
  }
  function closeMenu() {
    if (!document.body.classList.contains('menu-open')) return;
    document.body.classList.remove('menu-open');
    if (menu) menu.setAttribute('aria-hidden', 'true');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
  if (burger) {
    burger.addEventListener('click', () => {
      document.body.classList.contains('menu-open') ? closeMenu() : openMenu();
    });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- 7. CONSENT GATE ---------- */
  const consent = $('#consent');
  const hint = $('#consentHint');
  $$('[data-requires-consent]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (consent && !consent.checked) {
        e.preventDefault();
        if (hint) hint.hidden = false;
        if (hasGSAP) gsap.fromTo('.consent__box', { x: -4 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.35)' });
        scrollToHash('#reserve');
      }
    });
  });
  if (consent && hint) consent.addEventListener('change', () => { if (consent.checked) hint.hidden = true; });

  /* ---------- 8. DAYS — counter + drag to scroll ---------- */
  const dayIndex = $('#dayIndex');
  const dayCards = $$('.day');
  if (dayIndex && dayCards.length) {
    let queued = false;
    const updateIndex = () => {
      queued = false;
      const mid = window.innerWidth / 2;
      let best = 0, bestDist = Infinity;
      dayCards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      dayIndex.textContent = String(best + 1).padStart(2, '0');
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(updateIndex); } };
    window.addEventListener('scroll', queue, { passive: true });
    const trackEl = $('#daysTrack');
    if (trackEl) trackEl.addEventListener('scroll', queue, { passive: true });
    updateIndex();
  }

  const track = $('#daysTrack');
  if (track) {
    let down = false, startX = 0, startLeft = 0;
    track.addEventListener('pointerdown', (e) => {
      if (track.style.overflowX === 'visible') return;
      down = true; startX = e.clientX; startLeft = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
      track.style.cursor = 'grabbing';
    });
    track.addEventListener('pointermove', (e) => {
      if (!down) return;
      track.scrollLeft = startLeft - (e.clientX - startX);
    });
    ['pointerup', 'pointercancel'].forEach((ev) =>
      track.addEventListener(ev, () => { down = false; track.style.cursor = ''; })
    );
  }

  /* ---------- 9. BOOT ---------- */
  document.body.style.overflow = 'hidden';
  const start = () => { runIntro(); if (hasGSAP && typeof ScrollTrigger !== 'undefined') setTimeout(() => ScrollTrigger.refresh(), 600); };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);

  // safety: never leave the page locked behind the loader
  setTimeout(() => {
    document.body.style.overflow = '';
    const l = $('#loader');
    if (l) l.remove();
    if (!built) {
      $$('[data-reveal]').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
      buildScrollAnimations();
    }
  }, 6000);

  window.addEventListener('resize', () => {
    if (hasGSAP && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
})();
