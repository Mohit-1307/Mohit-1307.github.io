/* ═══════════════════════════════════════════════════════
   MSR.ai — Neural constellation background
   Lightweight canvas particle network, 60fps, DPR-aware,
   pauses off-tab, respects reduced-motion.
   ═══════════════════════════════════════════════════════ */
(() => {
  const canvas = document.getElementById('neural-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, dpr = 1, nodes = [], raf = null, running = false;
  const mouse = { x: -9999, y: -9999 };
  const LINK_DIST = 140;

  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  let primary = '#6366f1', accent = '#22d3ee';

  function refreshColors() {
    primary = cssVar('--primary') || primary;
    accent = cssVar('--accent') || accent;
  }

  function resize(reseed = true) {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reseed) seed();
  }
  let resizeTimer = null;
  function onResize() {
    // keep canvas crisp immediately, but only reseed particles once resizing settles
    resize(false);
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(seed, 220);
  }

  function seed() {
    const count = Math.min(90, Math.floor((W * H) / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.8 + .8,
      pulse: Math.random() * Math.PI * 2,
      hue: Math.random() < .78 // true => primary, false => accent
    }));
  }

  function step() {
    ctx.clearRect(0, 0, W, H);
    const t = performance.now() * .001;

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      // gentle mouse repulsion
      const dx = n.x - mouse.x, dy = n.y - mouse.y;
      const md = dx * dx + dy * dy;
      if (md < 22500) { n.x += dx / 900; n.y += dy / 900; }
      if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
    }

    // links
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          const alpha = (1 - d / LINK_DIST) * .22;
          ctx.strokeStyle = primary;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // nodes with soft pulse
    for (const n of nodes) {
      const p = (Math.sin(t * 1.6 + n.pulse) + 1) * .5; // 0..1
      ctx.globalAlpha = .35 + p * .45;
      ctx.fillStyle = n.hue ? primary : accent;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + p * .8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(step);
  }

  function start() {
    if (running || document.documentElement.classList.contains('reduce-motion')) return;
    running = true; refreshColors(); raf = requestAnimationFrame(step);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  // theme changes re-tint particles
  new MutationObserver(refreshColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-mode'] });

  // public hooks for reduced-motion toggle
  window.MSR_BG = { start, stop, drawOnce: () => { refreshColors(); ctx.clearRect(0, 0, W, H); } };

  resize();
  start();
})();
