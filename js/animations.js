(function () {
  'use strict';

  // ── Starfield canvas ──────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.id = 'starCanvas';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const STAR_COUNT = 110;
  let stars = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       Math.random() * 1.6 + 0.4,
      alpha:   Math.random(),
      dAlpha:  (Math.random() * 0.008 + 0.002) * (Math.random() < .5 ? 1 : -1),
      speed:   Math.random() * 0.25 + 0.05,
      angle:   Math.random() * Math.PI * 2,
      drift:   (Math.random() - 0.5) * 0.004,
    }));
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      // Twinkle
      s.alpha += s.dAlpha;
      if (s.alpha > 1 || s.alpha < 0) { s.dAlpha *= -1; s.alpha = Math.max(0, Math.min(1, s.alpha)); }

      // Drift
      s.angle  += s.drift;
      s.x      += Math.cos(s.angle) * s.speed;
      s.y      += Math.sin(s.angle) * s.speed;

      // Wrap around
      if (s.x < -5) s.x = canvas.width  + 5;
      if (s.x > canvas.width  + 5) s.x = -5;
      if (s.y < -5) s.y = canvas.height + 5;
      if (s.y > canvas.height + 5) s.y = -5;

      // Draw star
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5);
      glow.addColorStop(0,   `rgba(251,191,36,${s.alpha})`);
      glow.addColorStop(0.4, `rgba(251,191,36,${s.alpha * .4})`);
      glow.addColorStop(1,   'rgba(251,191,36,0)');

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,230,100,${s.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  // ── Mouse trail ───────────────────────────────────────────
  const TRAIL_LEN = 40;
  let trail = [];   // [{x,y,life}]

  window.addEventListener('mousemove', e => {
    trail.push({ x: e.clientX, y: e.clientY, life: 1 });
    if (trail.length > TRAIL_LEN) trail.shift();
  });

  function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ── fade & draw glowing trail ──
    trail.forEach(p => { p.life -= 0.025; });
    trail = trail.filter(p => p.life > 0);

    if (trail.length > 1) {
      for (let i = 1; i < trail.length; i++) {
        const t     = i / trail.length;
        const alpha = t * t * trail[i].life * 0.7;
        const width = t * 3.5 + 0.5;

        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x,     trail[i].y);
        ctx.strokeStyle = `rgba(251,191,36,${alpha * 0.35})`;
        ctx.lineWidth   = width * 3.5;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x,     trail[i].y);
        ctx.strokeStyle = `rgba(255,230,100,${alpha})`;
        ctx.lineWidth   = width;
        ctx.stroke();
      }

      const h  = trail[trail.length - 1];
      const hg = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 14);
      hg.addColorStop(0,   `rgba(255,245,180,${h.life * 0.7})`);
      hg.addColorStop(0.4, `rgba(251,191,36,${h.life * 0.25})`);
      hg.addColorStop(1,   'rgba(251,191,36,0)');
      ctx.beginPath();
      ctx.arc(h.x, h.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = hg;
      ctx.fill();
    }

    // ── draw stars ──
    stars.forEach(s => {
      s.alpha += s.dAlpha;
      if (s.alpha > 1 || s.alpha < 0) { s.dAlpha *= -1; s.alpha = Math.max(0, Math.min(1, s.alpha)); }
      s.angle += s.drift;
      s.x     += Math.cos(s.angle) * s.speed;
      s.y     += Math.sin(s.angle) * s.speed;
      if (s.x < -5) s.x = canvas.width + 5;
      if (s.x > canvas.width + 5) s.x = -5;
      if (s.y < -5) s.y = canvas.height + 5;
      if (s.y > canvas.height + 5) s.y = -5;

      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5);
      glow.addColorStop(0,   `rgba(251,191,36,${s.alpha})`);
      glow.addColorStop(0.4, `rgba(251,191,36,${s.alpha * .4})`);
      glow.addColorStop(1,   'rgba(251,191,36,0)');
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,230,100,${s.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(drawAll);
  }

  resize();
  initStars();
  drawAll();
  window.addEventListener('resize', () => { resize(); initStars(); });

  // ── Hero rotating text ────────────────────────────────────
  const heroLinesAr = [
    'المرجع الشامل للقادة في الشركة.',
    'يجمع معلومات التواصل وروابط التصعيد في مكان واحد.',
    'لأن الوصول السريع للشخص الصح يصنع الفرق.',
    '🏆 مبروك الفوز للعالمي! 🏆'
  ];
  const heroLinesEn = [
    'The ultimate leader reference for your company.',
    'Contact info and escalation links — all in one place.',
    'Because reaching the right person makes all the difference.'
  ];

  let heroLines    = heroLinesAr;
  let heroInterval = null;
  let heroIdx      = 0;
  const heroDesc   = document.querySelector('.hero-desc');

  function startHeroRotation() {
    if (!heroDesc) return;
    heroDesc.classList.add('hero-rotating');
    heroIdx = 0;
    heroDesc.classList.remove('hero-out');
    heroDesc.classList.add('hero-in');
    heroDesc.textContent = heroLines[0];

    if (heroInterval) clearInterval(heroInterval);
    heroInterval = setInterval(() => {
      heroDesc.classList.remove('hero-in');
      heroDesc.classList.add('hero-out');
      setTimeout(() => {
        heroIdx = (heroIdx + 1) % heroLines.length;
        heroDesc.textContent = heroLines[heroIdx];
        heroDesc.classList.remove('hero-out');
        heroDesc.classList.add('hero-in');
      }, 450);
    }, 3500);
  }

  // Exposed globally so applyLanguage() in i18n.js can call it
  window.setHeroLang = function (lang) {
    heroLines = lang === 'en' ? heroLinesEn : heroLinesAr;
    startHeroRotation();
  };

  // ── Scroll-reveal with IntersectionObserver ───────────────
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  function reveal(el, delay) {
    el.classList.add('js-reveal');
    if (delay) el.style.transitionDelay = delay + 's';
    io.observe(el);
  }

  function revealGrid(id) {
    const grid = document.getElementById(id);
    if (!grid) return;
    Array.from(grid.children).forEach((c, i) => reveal(c, (i % 8) * 0.06));
  }

  function init() {
    // Section headers
    document.querySelectorAll('.section-header, section > h3.section-title').forEach(el => reveal(el));

    // Grids
    ['quickLinksGrid', 'pdfGrid', 'escalationQuickGrid'].forEach(revealGrid);

    // Escalation accordion items
    document.querySelectorAll('.escalation-item').forEach((el, i) => reveal(el, i * 0.07));

    // Hero
    const hero = document.querySelector('.hero-section');
    if (hero) hero.classList.add('hero-anim');
  }

  // Run after render.js has populated the DOM
  document.addEventListener('DOMContentLoaded', () =>
    requestAnimationFrame(() => requestAnimationFrame(() => {
      init();
      // Use the persisted language preference on first load
      if (typeof currentLang !== 'undefined' && currentLang === 'en') heroLines = heroLinesEn;
      startHeroRotation();
    }))
  );
})();
