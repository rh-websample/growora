/* ==========================================================================
   GROWORA — main.js
   Vanilla JS: no build step required. Progressive enhancement throughout;
   every interaction degrades gracefully if JS fails to load.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------- Loader ---------------- */
  const loader = document.querySelector('.loader');
  const loaderBar = document.querySelector('.loader-bar');
  window.addEventListener('load', () => {
    requestAnimationFrame(() => { if (loaderBar) loaderBar.style.width = '100%'; });
    setTimeout(() => loader && loader.classList.add('hide'), 550);
  });
  // Safety net in case 'load' already fired
  if (document.readyState === 'complete') {
    if (loaderBar) loaderBar.style.width = '100%';
    setTimeout(() => loader && loader.classList.add('hide'), 400);
  }

  /* ---------------- Theme (dark mode) ---------------- */
  const root = document.documentElement;
  const THEME_KEY = 'growora-theme';
  function applyTheme(t) {
    root.classList.toggle('dark', t === 'dark');
  }
  const savedTheme = localStorage.getItem(THEME_KEY) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = root.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  });

  /* ---------------- Sticky nav blur ---------------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 12);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile menu ---------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      })
    );
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-scale]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el, i) => {
      el.style.setProperty('--i', i % 6);
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const decimals = el.dataset.count.includes('.') ? 1 : 0;
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = (decimals ? val.toFixed(1) : Math.round(val)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countIO.observe(el));
  }

  /* ---------------- Timeline progress fill ---------------- */
  const tlLine = document.querySelector('.tl-line-fill');
  const tlItems = document.querySelectorAll('.tl-item');
  function updateTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (vh * 0.75 - rect.top) / rect.height));
    if (tlLine) tlLine.style.height = (progress * 100) + '%';
    tlItems.forEach((item, i) => {
      const itemProgress = (i + 0.3) / tlItems.length;
      item.classList.toggle('in-view', progress >= itemProgress);
    });
  }
  if (document.querySelector('.timeline')) {
    document.addEventListener('scroll', updateTimeline, { passive: true });
    window.addEventListener('resize', updateTimeline);
    updateTimeline();
  }

  /* ---------------- Magnetic buttons ---------------- */
  document.querySelectorAll('.magnetic').forEach(wrap => {
    const btn = wrap.querySelector('.btn') || wrap;
    let raf = null;
    wrap.addEventListener('mousemove', (e) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.28;
      const y = (e.clientY - r.top - r.height / 2) * 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
    wrap.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      btn.style.transform = 'translate(0,0)';
    });
  });

  /* ---------------- Hero mouse parallax on blobs ---------------- */
  const mesh = document.querySelector('.mesh');
  const hero = document.querySelector('.hero');
  if (mesh && hero && window.matchMedia('(min-width:900px)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      mesh.querySelectorAll('.blob').forEach((b, i) => {
        const depth = (i + 1) * 14;
        b.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });
  }

  /* ---------------- Floating card mouse parallax ---------------- */
  const mockupWrap = document.querySelector('.mockup-wrap');
  if (mockupWrap && window.matchMedia('(min-width:900px)').matches) {
    document.addEventListener('mousemove', (e) => {
      const r = mockupWrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const x = (e.clientX - cx) / 40;
      const y = (e.clientY - cy) / 40;
      mockupWrap.querySelectorAll('.floating-card').forEach((c, i) => {
        const f = (i + 1) * 0.6;
        c.style.transform = `translate(${x * f}px, ${y * f}px)`;
      });
    });
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      q.setAttribute('aria-expanded', String(!isOpen));
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });

  /* ---------------- Newsletter form (demo only) ---------------- */
  document.querySelectorAll('.foot-news').forEach(form => {
    const btn = form.querySelector('button');
    const input = form.querySelector('input');
    if (!btn || !input) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!input.value.trim()) { input.focus(); return; }
      input.placeholder = 'Thanks — you\'re on the list!';
      input.value = '';
    });
  });

  /* ---------------- Smooth in-page scroll ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth' });
    });
  });

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = document.querySelectorAll('main [id]');
  const navA = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navA.length && 'IntersectionObserver' in window) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = '#' + entry.target.id;
        const link = document.querySelector(`.nav-links a[href="${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navA.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => navIO.observe(s));
  }
})();
