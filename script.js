// ── Topographic contour background ──────────────────────────────────
// One deliberate hero moment: a slowly drifting field of contour lines,
// generated from layered noise, evoking an elevation/terrain map.
(function () {
  const canvas = document.getElementById('contours');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let w, h, t = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Simple layered sine field standing in for elevation noise —
  // cheap to compute, no dependencies, reads as topography at this scale.
  function elevation(x, y, t) {
    return (
      Math.sin(x * 0.004 + t * 0.05) * Math.cos(y * 0.004 - t * 0.03) +
      Math.sin(x * 0.011 - y * 0.006 + t * 0.02) * 0.5
    );
  }

  const levels = 14;

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#8FBC8F';
    ctx.lineWidth = 1;

    const step = 10;
    for (let lvl = 0; lvl < levels; lvl++) {
      const threshold = (lvl / levels) * 2 - 1;
      ctx.globalAlpha = 0.10 + (lvl / levels) * 0.12;
      ctx.beginPath();
      for (let x = 0; x < w; x += step) {
        let started = false;
        for (let y = 0; y < h; y += step) {
          const e = elevation(x, y, t);
          if (Math.abs(e - threshold) < 0.02) {
            if (!started) { ctx.moveTo(x, y); started = true; }
            else ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
    }

    t += 1;
    requestAnimationFrame(draw);
  }

  draw();
})();

// ── Visitor field log ────────────────────────────────────────────────
// Abacus explicitly supports CORS for cross-origin fetch, unlike the
// two services tried before this. Namespaced to this domain to avoid
// key collisions with anyone else using the same public API.
(function () {
  const el = document.getElementById('visitor-log');
  if (!el) return;

  function ordinal(n) {
    const rem100 = n % 100;
    if (rem100 >= 11 && rem100 <= 13) return n + 'th';
    switch (n % 10) {
      case 1: return n + 'st';
      case 2: return n + 'nd';
      case 3: return n + 'rd';
      default: return n + 'th';
    }
  }

  fetch('https://abacus.jasoncameron.dev/hit/willieisdev.github.io/portfolio')
    .then((res) => res.json())
    .then((data) => {
      el.textContent = `Hello, welcome! You are the ${ordinal(data.value)} person to visit my portfolio.`;
    })
    .catch(() => {
      el.textContent = 'Hello, welcome to my portfolio.';
    });
})();