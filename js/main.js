/* ═══════════════════════════════════════════════════════
   Base JS – Universal Website Builder
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── HERO VIDEO: force autoplay ── */
(function initHeroVideo() {
  const video = document.querySelector('.hero__bg video');
  if (!video) return;
  video.muted = true;
  const promise = video.play();
  if (promise !== undefined) {
    promise.catch(() => {
      document.addEventListener('click', () => video.play(), { once: true });
      document.addEventListener('touchstart', () => video.play(), { once: true });
    });
  }
})();

/* ── NAV: Scroll state ── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── NAV: Mobile burger (supports static nav__mobile in DOM) ── */
(function initBurger() {
  const burger = document.querySelector('.nav__burger');
  const mobile = document.querySelector('.nav__mobile');
  if (!burger || !mobile) return;

  function open() {
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    mobile.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobile.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    burger.classList.contains('open') ? close() : open();
  });

  // Close on link click
  mobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', close);
  });

  window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ── SMOOTH HOVER: Service cards ── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      const tiltX = y * 4;
      const tiltY = -x * 4;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── GALLERY CAROUSEL ── */
(function initGalleryCarousel() {
  const track    = document.getElementById('galleryTrack');
  const dotsWrap = document.getElementById('galleryDots');
  if (!track) return;

  const slides   = Array.from(track.children);
  const btnPrev  = document.querySelector('.gallery__btn--prev');
  const btnNext  = document.querySelector('.gallery__btn--next');

  function getSlidesVisible() {
    if (window.innerWidth <= 600)  return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  let current = 0;

  function maxIndex() {
    return Math.max(0, slides.length - getSlidesVisible());
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const d = document.createElement('button');
      d.className = 'dot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    const slideW = slides[0].offsetWidth + gap;
    track.style.transform = `translateX(-${current * slideW}px)`;
    if (dotsWrap) {
      dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }
  }

  btnPrev && btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext && btnNext.addEventListener('click', () => goTo(current + 1));

  // Touch/swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  buildDots();
  window.addEventListener('resize', () => { buildDots(); goTo(Math.min(current, maxIndex())); });
})();

/* ── FAQ ACCORDION ── */
(function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const summary = item.querySelector('summary');
    if (!summary) return;
    // Smooth toggle (details element handles open/close natively)
  });
})();

/* ── ACTIVE nav link highlight on scroll ── */
(function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if (!navLinks.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
})();
