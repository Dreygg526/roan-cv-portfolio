/* PORTFOLIO — SPLIT RAIL (won the 2026-10 redesign as 01-split-rail-evolved)
   Theme toggle · rail scroll-spy · reveal · click-to-enter intro (FLIP) ·
   dot + trailing ring cursor that magnetises onto interactive elements. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var KEY = 'theme';

  /* ---------------------------------------------------------- THEME
     The head script already set data-theme before paint: dark on a first visit, whatever the
     system says. A LIVE system change during the visit is applied below, but only while the
     visitor has not clicked; the click is saved and locks the choice in both directions. */
  var toggle = document.getElementById('themeToggle');
  function paint(t) {
    root.setAttribute('data-theme', t);
    if (toggle) toggle.setAttribute('aria-pressed', String(t === 'light'));
  }
  paint(root.getAttribute('data-theme') || 'dark');
  if (toggle) toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    try { localStorage.setItem(KEY, next); } catch (e) {}
    root.setAttribute('data-theme-locked', '');
    paint(next);
  });
  var sys = window.matchMedia('(prefers-color-scheme: light)');
  var onSys = function (e) { if (!root.hasAttribute('data-theme-locked')) paint(e.matches ? 'light' : 'dark'); };
  if (sys.addEventListener) sys.addEventListener('change', onSys); else if (sys.addListener) sys.addListener(onSys);

  /* ------------------------------------------------------ SCROLL SPY */
  var links = Array.prototype.slice.call(document.querySelectorAll('.rail-nav a'));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function setActive(i) {
    links.forEach(function (a, j) { if (j === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  /* The last section can never reach the observer band once the page bottoms out. */
  function atBottom() { return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2; }
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      if (atBottom()) { setActive(links.length - 1); return; }
      entries.forEach(function (en) { if (en.isIntersecting) setActive(targets.indexOf(en.target)); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    targets.forEach(function (t) { if (t) spy.observe(t); });
    window.addEventListener('scroll', function () { if (atBottom()) setActive(links.length - 1); }, { passive: true });
  }

  /* --------------------------------------------------------- REVEAL
     The class is applied now, the observer only starts after the intro: started early it
     would fire against a hidden main and every animation would play into nothing. */
  var items = document.querySelectorAll('.card, .sh, .stack, .more, .mail-line, .p.lead, .cv-inline');
  var canReveal = ('IntersectionObserver' in window) && !reduce.matches;
  var revealStarted = false;
  if (canReveal) items.forEach(function (el) { el.classList.add('reveal'); });
  function startReveal() {
    if (!canReveal || revealStarted) return;
    revealStarted = true;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------ INTRO
     FLIP on .rail-top: it stays in its real DOM position and is moved with transform only. */
  var railTop = document.querySelector('.rail-top');
  var introGo = document.getElementById('introGo');
  var introSkip = document.getElementById('introSkip');
  var introDone = false;
  function onIntroKey(e) { if (e.key === 'Escape') exitIntro(); }
  function onIntroResize() { if (window.innerHeight < 520) exitIntro(); }

  function startIntro() {
    if (!root.classList.contains('intro')) { startReveal(); return; }
    document.addEventListener('keydown', onIntroKey);
    if (introSkip) introSkip.addEventListener('click', exitIntro);
    if (introGo) {
      introGo.addEventListener('click', exitIntro);
      try { introGo.focus({ preventScroll: true }); } catch (e) { introGo.focus(); }
    }
    /* Never a trap: a viewport that shrinks below the centred block (rotating a phone to
       landscape) releases the gate rather than leaving the content unreachable. */
    window.addEventListener('resize', onIntroResize);
  }

  function exitIntro() {
    if (introDone) return;
    introDone = true;
    document.removeEventListener('keydown', onIntroKey);
    window.removeEventListener('resize', onIntroResize);
    if (!railTop || reduce.matches) { root.classList.remove('intro'); startReveal(); window.dispatchEvent(new Event('introdone')); return; }

    var first = railTop.getBoundingClientRect();
    root.classList.remove('intro');
    window.dispatchEvent(new Event('introdone'));   /* the gate is gone: free the cursor now */
    var last = railTop.getBoundingClientRect();
    var dx = first.left - last.left, dy = first.top - last.top;
    var sc = last.width ? first.width / last.width : 1;

    railTop.style.transformOrigin = '0 0';
    railTop.style.transition = 'none';
    railTop.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sc + ')';
    void railTop.offsetWidth;
    railTop.style.transition = 'transform .75s cubic-bezier(.4,0,.2,1)';
    railTop.style.transform = 'none';

    var cleared = false;
    var clear = function () {
      if (cleared) return;
      cleared = true;
      railTop.style.transition = railTop.style.transform = railTop.style.transformOrigin = '';
      startReveal();
    };
    railTop.addEventListener('transitionend', clear, { once: true });
    setTimeout(clear, 950); /* transitionend is not guaranteed */
  }
  startIntro();

  /* ---------------------------------------------------------- CURSOR
     Fast dot leads, slow ring trails. Over an interactive element the ring snaps to its box.
     Transforms only; rAF loop stops itself when still. Touch devices bail before binding. */
  if (!window.matchMedia('(pointer: fine)').matches || navigator.maxTouchPoints > 1) return;
  var dot = document.getElementById('curDot');
  var ring = document.getElementById('curRing');
  if (!dot || !ring) return;

  var MAGNET = '.rail-nav a, .socials a, .theme, .card-t[href], .ulink, .mail, .skip, .intro-go, .intro-skip, .more summary, .lp-card';
  var tx = -100, ty = -100, dx = -100, dy = -100, rx = -100, ry = -100;
  var live = false, raf = null, snapped = null, snapX = 0, snapY = 0;

  function frame() {
    var kd = reduce.matches ? 1 : 0.32, kr = reduce.matches ? 1 : 0.13;
    dx += (tx - dx) * kd; dy += (ty - dy) * kd;
    var gx = snapped ? snapX : tx, gy = snapped ? snapY : ty;
    rx += (gx - rx) * kr; ry += (gy - ry) * kr;
    dot.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
    ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
    var moving = Math.abs(tx - dx) > .2 || Math.abs(ty - dy) > .2 || Math.abs(gx - rx) > .2 || Math.abs(gy - ry) > .2;
    raf = moving ? requestAnimationFrame(frame) : null;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  function release() {
    snapped = null; ring.classList.remove('snap'); dot.classList.remove('snap');
    ring.style.width = ring.style.height = ring.style.margin = '';
  }
  function grab(el) {
    var r = el.getBoundingClientRect();
    snapped = el; snapX = r.left + r.width / 2; snapY = r.top + r.height / 2;
    var w = Math.round(r.width + 12), h = Math.round(r.height + 8);
    ring.style.width = w + 'px'; ring.style.height = h + 'px';
    ring.style.margin = (-h / 2) + 'px 0 0 ' + (-w / 2) + 'px';
    ring.classList.add('snap'); dot.classList.add('snap');
  }
  function hide() {
    live = false; dot.classList.remove('on'); ring.classList.remove('on');
    root.classList.remove('cursor-active'); release();
  }
  window.addEventListener('mousemove', function (e) {
    tx = e.clientX; ty = e.clientY;
    if (!live) {
      live = true; dx = rx = tx; dy = ry = ty;
      dot.classList.add('on'); ring.classList.add('on'); root.classList.add('cursor-active');
    }
    var m = e.target.closest ? e.target.closest(MAGNET) : null;
    if (m !== snapped) { if (m) grab(m); else release(); }
    kick();
  }, { passive: true });
  /* The gate button disappears when the intro ends; a ring still snapped to it would hang
     over the text until the mouse moved. Re-target from where the pointer actually is. */
  window.addEventListener('introdone', function () {
    if (!snapped || snapped.getClientRects().length) return;
    release();
    var under = live ? document.elementFromPoint(tx, ty) : null;
    var m = under && under.closest ? under.closest(MAGNET) : null;
    if (m) grab(m);
    kick();
  });
  window.addEventListener('scroll', function () {
    if (!snapped) return;
    if (!document.body.contains(snapped)) { release(); return; }
    var r = snapped.getBoundingClientRect();
    snapX = r.left + r.width / 2; snapY = r.top + r.height / 2; kick();
  }, { passive: true });
  document.addEventListener('mouseout', function (e) { if (e.relatedTarget === null) hide(); });
  window.addEventListener('blur', hide);
  window.addEventListener('keydown', function (e) { if (e.key === 'Tab') hide(); });
})();
